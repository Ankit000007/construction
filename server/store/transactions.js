const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "transactions.json");

// Load transactions from file on startup
function loadTransactions() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error loading transactions:", err.message);
  }
  return [];
}

let transactions = loadTransactions();

function save() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(transactions, null, 2));
  } catch (err) {
    console.error("Error saving transactions:", err.message);
  }
}

const transactionStore = {
  add(txn) {
    transactions.push({
      ...txn,
      createdAt: new Date().toISOString(),
      settlementStatus: "unsettled",
      settlementRequestedAt: null,
    });
    save();
  },

  updateByOrderId(orderId, updates) {
    const index = transactions.findIndex((t) => t.orderId === orderId);
    if (index !== -1) {
      transactions[index] = { ...transactions[index], ...updates };
      save();
      return transactions[index];
    }
    return null;
  },

  getByOrderId(orderId) {
    return transactions.find((t) => t.orderId === orderId) || null;
  },

  getAll() {
    return [...transactions].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  },

  getSuccessful() {
    return transactions
      .filter((t) => t.paymentStatus === "TXN_SUCCESS")
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  getUnsettled() {
    return transactions
      .filter(
        (t) =>
          t.paymentStatus === "TXN_SUCCESS" &&
          t.settlementStatus === "unsettled"
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  getSummary() {
    const all = transactions;
    const successful = all.filter((t) => t.paymentStatus === "TXN_SUCCESS");
    const unsettled = successful.filter(
      (t) => t.settlementStatus === "unsettled"
    );
    const settlementRequested = successful.filter(
      (t) => t.settlementStatus === "settlement_requested"
    );
    const settled = successful.filter((t) => t.settlementStatus === "settled");

    return {
      totalTransactions: all.length,
      successfulPayments: successful.length,
      failedPayments: all.filter((t) => t.paymentStatus === "TXN_FAILURE")
        .length,
      pendingPayments: all.filter((t) => t.paymentStatus === "PENDING").length,
      totalRevenue: successful.reduce(
        (sum, t) => sum + parseFloat(t.amount || 0),
        0
      ),
      unsettledAmount: unsettled.reduce(
        (sum, t) => sum + parseFloat(t.amount || 0),
        0
      ),
      unsettledCount: unsettled.length,
      settlementRequestedCount: settlementRequested.length,
      settledCount: settled.length,
    };
  },
};

module.exports = transactionStore;
