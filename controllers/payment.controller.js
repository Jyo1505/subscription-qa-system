const db = require("../config/db");
const isAllowed = require("../utils/timeCheck");
const mailer = require("../utils/mailer");

const PLANS = {
  BRONZE: { price: 100, limit: 5 },
  SILVER: { price: 300, limit: 10 },
  GOLD: { price: 1000, limit: 9999 }
};
const PLAN_LEVEL = {
  FREE: 0,
  BRONZE: 1,
  SILVER: 2,
  GOLD: 3
};

exports.fakePayment = (req, res) => {
  if (!isAllowed()) {
    return res.status(403).json({
      message: "Payments allowed only between 10–11 AM IST"
    });
  }

  const { plan } = req.body;

  db.query(
    "SELECT plan, expires_at FROM subscriptions WHERE user_id=?",
    [req.userId],
    (err, result) => {

      if (err) {
        return res.status(500).json({ message: "Database error" });
      }

      // ✅ If subscription record missing, create FREE plan
      if (result.length === 0) {
        db.query(
          "INSERT INTO subscriptions (user_id, plan, daily_limit) VALUES (?, 'FREE', 1)",
          [req.userId],
          () => {
            return res.status(200).json({
              message: "Free plan created. Please try payment again."
            });
          }
        );
        return;
      }

      const currentPlan = result[0].plan;
      const expiry = result[0].expires_at;

      // ✅ If active plan exists, block payment
      // ✅ If active plan exists, apply upgrade rules
if (expiry && new Date(expiry) > new Date()) {

  // same plan or downgrade → block
  if (PLAN_LEVEL[plan] <= PLAN_LEVEL[currentPlan]) {
    return res.status(400).json({
      message: `Your ${currentPlan} plan is active until ${new Date(expiry).toDateString()}. You can only upgrade to a higher plan.`
    });
  }

  // higher plan → allowed (continue payment)
}


      // ✅ Continue new payment
      const selectedPlan = PLANS[plan];
      if (!selectedPlan) {
        return res.status(400).json({ message: "Invalid plan selected" });
      }

      const transactionId = "TXN" + Date.now();

      const newExpiry = new Date();
      newExpiry.setDate(newExpiry.getDate() + 30);

      db.query(
        "UPDATE subscriptions SET plan=?, daily_limit=?, expires_at=? WHERE user_id=?",
        [plan, selectedPlan.limit, newExpiry, req.userId],
        () => {

          db.query(
            "SELECT email FROM users WHERE id=?",
            [req.userId],
            async (err, result) => {

              if (result.length) {
                await mailer.sendInvoice(result[0].email, {
                  plan,
                  amount: selectedPlan.price,
                  txnId: transactionId,
                  expiry: newExpiry.toDateString(),
                  date: new Date().toDateString()
                });
              }

              res.json({
                message: "Payment successful. Invoice sent to email.",
                transactionId
              });
            }
          );
        }
      );
    }
  );
};


