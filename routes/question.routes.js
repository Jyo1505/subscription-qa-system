const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const question = require("../controllers/question.controller");

router.post("/ask", auth, question.ask);

module.exports = router;
