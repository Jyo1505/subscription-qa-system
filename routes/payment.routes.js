const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const pay = require("../controllers/payment.controller");

router.post("/fake-pay", auth, pay.fakePayment);

module.exports = router;
