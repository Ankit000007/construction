const express = require("express");
const https = require("https");
const PaytmChecksum = require("paytmchecksum");
const paytmConfig = require("../config/paytm");
const transactionStore = require("../store/transactions");

const router = express.Router();

// GET /api/admin/summary - Dashboard summary
router.get("/summary", (req, res) => {
  try {
    const summary = transactionStore.getSummary();
    res.json({ success: true, data: summary });
  } catch (error) {
    console.error("Summary error:", error);
    res.status(500).json({ success: false, message: "Failed to get summary." });
  }
});

// GET /api/admin/transactions - All transactions
router.get("/transactions", (req, res) => {
  try {
    const { status } = req.query;
    let data;
    if (status === "successful") {
      data = transactionStore.getSuccessful();
    } else if (status === "unsettled") {
      data = transactionStore.getUnsettled();
    } else {
      data = transactionStore.getAll();
    }
    res.json({ success: true, data });
  } catch (error) {
    console.error("Transactions list error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch transactions." });
  }
});

// POST /api/admin/settlement/request - Request on-demand settlement for specific orders
router.post("/settlement/request", async (req, res) => {
  try {
    const { orderIds } = req.body;

    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Provide an array of orderIds to settle.",
      });
    }

    const results = [];

    for (const orderId of orderIds) {
      const txn = transactionStore.getByOrderId(orderId);

      if (!txn) {
        results.push({
          orderId,
          success: false,
          message: "Transaction not found.",
        });
        continue;
      }

      if (txn.paymentStatus !== "TXN_SUCCESS") {
        results.push({
          orderId,
          success: false,
          message: "Only successful transactions can be settled.",
        });
        continue;
      }

      if (txn.settlementStatus === "settled") {
        results.push({
          orderId,
          success: false,
          message: "Already settled.",
        });
        continue;
      }

      try {
        // Call Paytm Settlement API
        const settlementResult = await requestSettlement(orderId);

        const resultStatus =
          settlementResult.body?.resultInfo?.resultStatus ||
          settlementResult.status;

        if (
          resultStatus === "SUCCESS" ||
          resultStatus === "S" ||
          resultStatus === "ACCEPTED"
        ) {
          transactionStore.updateByOrderId(orderId, {
            settlementStatus: "settlement_requested",
            settlementRequestedAt: new Date().toISOString(),
            settlementResponse: settlementResult,
          });
          results.push({ orderId, success: true, message: "Settlement requested." });
        } else {
          // Even if the API doesn't support on-demand, mark it as requested
          transactionStore.updateByOrderId(orderId, {
            settlementStatus: "settlement_requested",
            settlementRequestedAt: new Date().toISOString(),
            settlementResponse: settlementResult,
          });
          results.push({
            orderId,
            success: true,
            message:
              settlementResult.body?.resultInfo?.resultMsg ||
              "Settlement request submitted. Paytm will process based on your settlement cycle.",
          });
        }
      } catch (apiError) {
        // If API call fails, still mark as requested for manual tracking
        transactionStore.updateByOrderId(orderId, {
          settlementStatus: "settlement_requested",
          settlementRequestedAt: new Date().toISOString(),
        });
        results.push({
          orderId,
          success: true,
          message:
            "Settlement marked as requested. Will be processed in next settlement cycle.",
        });
      }
    }

    res.json({ success: true, results });
  } catch (error) {
    console.error("Settlement request error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to process settlement request." });
  }
});

// POST /api/admin/settlement/mark-settled - Manually mark orders as settled
router.post("/settlement/mark-settled", (req, res) => {
  try {
    const { orderIds } = req.body;

    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Provide an array of orderIds.",
      });
    }

    const results = [];
    for (const orderId of orderIds) {
      const updated = transactionStore.updateByOrderId(orderId, {
        settlementStatus: "settled",
        settledAt: new Date().toISOString(),
      });
      results.push({
        orderId,
        success: !!updated,
        message: updated ? "Marked as settled." : "Transaction not found.",
      });
    }

    res.json({ success: true, results });
  } catch (error) {
    console.error("Mark settled error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to mark as settled." });
  }
});

// POST /api/admin/refresh-status/:orderId - Re-check payment status from Paytm
router.post("/refresh-status/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    const paytmParams = {
      body: { mid: paytmConfig.MID, orderId },
    };

    const checksum = await PaytmChecksum.generateSignature(
      JSON.stringify(paytmParams.body),
      paytmConfig.MERCHANT_KEY
    );
    paytmParams.head = { signature: checksum };

    const statusResult = await callPaytmPost(
      paytmConfig.getTransactionStatusUrl(),
      paytmParams
    );

    const status = statusResult.body?.resultInfo?.resultStatus;
    if (status) {
      transactionStore.updateByOrderId(orderId, {
        paymentStatus: status,
        resultMsg: statusResult.body?.resultInfo?.resultMsg || "",
        lastCheckedAt: new Date().toISOString(),
      });
    }

    res.json({
      success: true,
      data: statusResult,
      stored: transactionStore.getByOrderId(orderId),
    });
  } catch (error) {
    console.error("Refresh status error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to refresh status." });
  }
});

// Helper: Request settlement via Paytm API
function requestSettlement(orderId) {
  return new Promise(async (resolve, reject) => {
    try {
      const paytmParams = {
        body: {
          mid: paytmConfig.MID,
          orderId: orderId,
          settlementType: "ON_DEMAND",
        },
      };

      const checksum = await PaytmChecksum.generateSignature(
        JSON.stringify(paytmParams.body),
        paytmConfig.MERCHANT_KEY
      );
      paytmParams.head = { signature: checksum };

      const url = `${paytmConfig.PAYTM_HOST}/v1/disburse/order/settlement`;
      const result = await callPaytmPost(url, paytmParams);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

// Helper: Generic Paytm POST
function callPaytmPost(url, params) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(params);
    const parsedUrl = new URL(url);

    const options = {
      hostname: parsedUrl.hostname,
      port: 443,
      path: parsedUrl.pathname + parsedUrl.search,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(postData),
      },
    };

    const request = https.request(options, (response) => {
      let data = "";
      response.on("data", (chunk) => (data += chunk));
      response.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve({ raw: data });
        }
      });
    });

    request.on("error", reject);
    request.write(postData);
    request.end();
  });
}

module.exports = router;
