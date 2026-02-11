const express = require("express");
const { v4: uuidv4 } = require("uuid");
const https = require("https");
const PaytmChecksum = require("paytmchecksum");
const paytmConfig = require("../config/paytm");
const transactionStore = require("../store/transactions");

const router = express.Router();

// In-memory store for pending payment params (orderId -> params)
const pendingPayments = new Map();

// POST /api/payment/initiate - Start a new payment
router.post("/initiate", async (req, res) => {
  try {
    const { amount, customerName, customerEmail, customerPhone } = req.body;

    if (!amount || !customerName || !customerPhone) {
      return res.status(400).json({
        success: false,
        message: "Amount, customer name, and phone are required.",
      });
    }

    const orderId = "ORDER_" + uuidv4().replace(/-/g, "").substring(0, 16);
    const customerId = "CUST_" + uuidv4().replace(/-/g, "").substring(0, 12);

    // Prepare form parameters for Paytm
    const paytmParams = {
      MID: paytmConfig.MID,
      WEBSITE: paytmConfig.WEBSITE,
      CHANNEL_ID: paytmConfig.CHANNEL_ID,
      INDUSTRY_TYPE_ID: paytmConfig.INDUSTRY_TYPE,
      ORDER_ID: orderId,
      CUST_ID: customerId,
      TXN_AMOUNT: parseFloat(amount).toFixed(2),
      CALLBACK_URL: paytmConfig.CALLBACK_URL,
      EMAIL: customerEmail || "",
      MOBILE_NO: customerPhone,
    };

    // Generate checksum from params object
    const checksum = await PaytmChecksum.generateSignature(
      paytmParams,
      paytmConfig.MERCHANT_KEY
    );
    paytmParams.CHECKSUMHASH = checksum;

    // Store payment params so the redirect route can serve the form
    pendingPayments.set(orderId, paytmParams);

    // Auto-clean after 15 minutes
    setTimeout(() => pendingPayments.delete(orderId), 15 * 60 * 1000);

    // Store transaction record
    transactionStore.add({
      orderId,
      customerId,
      customerName,
      customerEmail: customerEmail || "",
      customerPhone,
      amount: paytmParams.TXN_AMOUNT,
      paymentStatus: "INITIATED",
      txnId: null,
    });

    console.log(`Payment initiated: ${orderId} | Amount: ₹${paytmParams.TXN_AMOUNT} | Customer: ${customerName}`);

    // Return URL to our own redirect page (frontend redirects here)
    const serverBaseUrl = process.env.SERVER_URL || `${req.protocol}://${req.get("host")}`;
    res.json({
      success: true,
      orderId: orderId,
      amount: paytmParams.TXN_AMOUNT,
      paymentUrl: `${serverBaseUrl}/api/payment/redirect/${orderId}`,
    });
  } catch (error) {
    console.error("Payment initiation error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during payment initiation.",
    });
  }
});

// GET /api/payment/redirect/:orderId - Serves auto-submitting form to Paytm
router.get("/redirect/:orderId", (req, res) => {
  const { orderId } = req.params;
  const params = pendingPayments.get(orderId);

  if (!params) {
    return res.status(404).send(`
      <html><body style="font-family:sans-serif;text-align:center;padding:60px">
        <h2>Payment session expired or not found.</h2>
        <p>Please go back and try again.</p>
        <a href="${process.env.FRONTEND_URL}/checkout">Back to Checkout</a>
      </body></html>
    `);
  }

  // Build hidden form fields
  const hiddenFields = Object.entries(params)
    .map(
      ([key, value]) =>
        `<input type="hidden" name="${key}" value="${String(value).replace(/"/g, "&quot;")}" />`
    )
    .join("\n        ");

  const paytmUrl = paytmConfig.getPaymentUrl();

  // Serve auto-submitting HTML form
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Redirecting to Paytm...</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          margin: 0;
          background: #f5f5f5;
        }
        .loader {
          text-align: center;
        }
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #e0e0e0;
          border-top: 4px solid #00B9F5;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 20px;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        h2 { color: #333; margin-bottom: 8px; }
        p { color: #666; }
      </style>
    </head>
    <body>
      <div class="loader">
        <div class="spinner"></div>
        <h2>Redirecting to Paytm</h2>
        <p>Please wait, do not close this window...</p>
      </div>
      <form id="paytmForm" method="POST" action="${paytmUrl}">
        ${hiddenFields}
      </form>
      <script>document.getElementById('paytmForm').submit();</script>
    </body>
    </html>
  `);

  // Clean up after serving
  pendingPayments.delete(orderId);
});

// POST /api/payment/callback - Paytm sends response here after payment
router.post("/callback", async (req, res) => {
  try {
    const paytmResponse = req.body;
    console.log("Paytm Callback Response:", JSON.stringify(paytmResponse, null, 2));

    // Extract checksum and verify
    const receivedChecksum = paytmResponse.CHECKSUMHASH;
    const paramsForVerify = { ...paytmResponse };
    delete paramsForVerify.CHECKSUMHASH;

    let isValidChecksum = false;
    try {
      isValidChecksum = PaytmChecksum.verifySignature(
        paramsForVerify,
        paytmConfig.MERCHANT_KEY,
        receivedChecksum
      );
    } catch (checksumError) {
      console.error("Checksum verification error:", checksumError.message);
    }

    if (!isValidChecksum) {
      console.error("Checksum verification failed for order:", paytmResponse.ORDERID);
      return res.redirect(
        `${process.env.FRONTEND_URL}/payment-result?status=failed&reason=checksum_failed`
      );
    }

    console.log("Checksum verified successfully.");

    const orderId = paytmResponse.ORDERID;
    const txnId = paytmResponse.TXNID || "";
    const amount = paytmResponse.TXNAMOUNT || "";
    const callbackStatus = paytmResponse.STATUS;

    // Verify transaction status with Paytm Transaction Status API
    let finalStatus = callbackStatus;
    try {
      const txnStatus = await verifyTransactionStatus(orderId);
      finalStatus =
        txnStatus.body?.resultInfo?.resultStatus || callbackStatus;

      // Update stored transaction with full details
      transactionStore.updateByOrderId(orderId, {
        paymentStatus: finalStatus,
        txnId,
        amount,
        paymentMode: paytmResponse.PAYMENTMODE || "",
        bankName: paytmResponse.BANKNAME || "",
        bankTxnId: paytmResponse.BANKTXNID || "",
        gatewayName: paytmResponse.GATEWAYNAME || "",
        resultMsg:
          txnStatus.body?.resultInfo?.resultMsg ||
          paytmResponse.RESPMSG ||
          "",
        completedAt: new Date().toISOString(),
      });
    } catch (statusError) {
      console.error("Status verification failed, using callback status:", statusError.message);
      // Fallback: use callback status directly
      transactionStore.updateByOrderId(orderId, {
        paymentStatus: callbackStatus,
        txnId,
        amount,
        paymentMode: paytmResponse.PAYMENTMODE || "",
        bankName: paytmResponse.BANKNAME || "",
        bankTxnId: paytmResponse.BANKTXNID || "",
        resultMsg: paytmResponse.RESPMSG || "",
        completedAt: new Date().toISOString(),
      });
    }

    if (finalStatus === "TXN_SUCCESS") {
      console.log(`Payment SUCCESS: ${orderId} | ₹${amount}`);
      res.redirect(
        `${process.env.FRONTEND_URL}/payment-result?status=success&orderId=${orderId}&txnId=${txnId}&amount=${amount}`
      );
    } else if (finalStatus === "PENDING") {
      console.log(`Payment PENDING: ${orderId} | ₹${amount}`);
      res.redirect(
        `${process.env.FRONTEND_URL}/payment-result?status=pending&orderId=${orderId}&txnId=${txnId}&amount=${amount}`
      );
    } else {
      const reason = paytmResponse.RESPMSG || "Payment failed or cancelled";
      console.log(`Payment FAILED: ${orderId} | Reason: ${reason}`);
      res.redirect(
        `${process.env.FRONTEND_URL}/payment-result?status=failed&orderId=${orderId}&reason=${encodeURIComponent(reason)}`
      );
    }
  } catch (error) {
    console.error("Callback processing error:", error);
    res.redirect(
      `${process.env.FRONTEND_URL}/payment-result?status=failed&reason=server_error`
    );
  }
});

// GET /api/payment/status/:orderId - Check transaction status
router.get("/status/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const txnStatus = await verifyTransactionStatus(orderId);

    res.json({
      success: true,
      data: txnStatus,
    });
  } catch (error) {
    console.error("Transaction status check error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to check transaction status.",
    });
  }
});

// Helper: Verify transaction status with Paytm
function verifyTransactionStatus(orderId) {
  return new Promise(async (resolve, reject) => {
    try {
      const paytmParams = {
        body: {
          mid: paytmConfig.MID,
          orderId: orderId,
        },
      };

      const checksum = await PaytmChecksum.generateSignature(
        JSON.stringify(paytmParams.body),
        paytmConfig.MERCHANT_KEY
      );

      paytmParams.head = {
        signature: checksum,
      };

      const postData = JSON.stringify(paytmParams);
      const url = new URL(paytmConfig.getTransactionStatusUrl());

      const options = {
        hostname: url.hostname,
        port: 443,
        path: url.pathname,
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
            const parsed = JSON.parse(data);
            console.log("Transaction Status:", JSON.stringify(parsed, null, 2));
            resolve(parsed);
          } catch (parseError) {
            reject(parseError);
          }
        });
      });

      request.on("error", reject);
      request.write(postData);
      request.end();
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = router;
