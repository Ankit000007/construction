const paytmConfig = {
  MID: process.env.PAYTM_MID,
  MERCHANT_KEY: process.env.PAYTM_MERCHANT_KEY,
  WEBSITE: process.env.PAYTM_WEBSITE,
  CHANNEL_ID: process.env.PAYTM_CHANNEL_ID,
  INDUSTRY_TYPE: process.env.PAYTM_INDUSTRY_TYPE,
  CALLBACK_URL: process.env.PAYTM_CALLBACK_URL,

  PAYTM_HOST:
    process.env.PAYTM_ENV === "production"
      ? "https://securegw.paytm.in"
      : "https://securegw-stage.paytm.in",

  // Form-based redirect URL (works with all merchant accounts)
  getPaymentUrl() {
    return `${this.PAYTM_HOST}/order/process`;
  },

  getTransactionStatusUrl() {
    return `${this.PAYTM_HOST}/v3/order/status`;
  },
};

module.exports = paytmConfig;
