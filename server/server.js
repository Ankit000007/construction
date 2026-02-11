require("dotenv").config();
const express = require("express");
const cors = require("cors");
const paymentRoutes = require("./routes/payment");
const adminRoutes = require("./routes/admin");

const app = express();
const PORT = process.env.PORT || 5000;

// Simple in-memory rate limiter
function rateLimit({ windowMs = 60000, max = 10, message = "Too many requests, please try again later." } = {}) {
  const hits = new Map();

  // Cleanup old entries every minute
  setInterval(() => {
    const now = Date.now();
    for (const [key, data] of hits) {
      if (now - data.resetTime > windowMs) {
        hits.delete(key);
      }
    }
  }, windowMs);

  return (req, res, next) => {
    const key = req.ip;
    const now = Date.now();
    const record = hits.get(key);

    if (!record || now > record.resetTime) {
      hits.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (record.count >= max) {
      return res.status(429).json({ success: false, message });
    }

    record.count++;
    next();
  };
}

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting on payment endpoints
app.use("/api/payment", rateLimit({ windowMs: 60000, max: 10, message: "Too many payment requests. Please wait a moment." }));

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
