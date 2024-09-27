const axios = require("axios");
require("dotenv").config();

module.exports = {
  generatePayment: async (req, res) => {
    try {
      const { amount, developerTrackingId, orderId } = req.body;
      console.log(amount, developerTrackingId, orderId);
      const response = await axios.post(
        "https://developers.flouci.com/api/generate_payment",
        {
          app_token: process.env.FLOUCI_APP_TOKEN,
          app_secret: process.env.FLOUCI_APP_SECRET,
          amount: amount * 1000,
          accept_card: "true",
          session_timeout_secs: 1200,
          success_link: `${process.env.SUCCESS_LINK}?orderId=${orderId}`,
          fail_link: process.env.FAILED_LINK,
          developer_tracking_id: developerTrackingId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("-------flouci response ; ------- ", response);
      res.json(response.data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to generate payment" });
    }
  },
};
