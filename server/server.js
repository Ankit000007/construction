require("dotenv").config();
const express = require("express");
const cors = require("cors");
const paymentRoutes = require("./routes/payment");
const adminRoutes = require("./routes/admin");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Payment server is running" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Payment server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.PAYTM_ENV || "staging"}`);
  console.log(`Merchant ID: ${process.env.PAYTM_MID}`);
  console.log(`Website: ${process.env.PAYTM_WEBSITE}`);
  console.log(`Key length: ${(process.env.PAYTM_MERCHANT_KEY || "").length} chars`);
});
