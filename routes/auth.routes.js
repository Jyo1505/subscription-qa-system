const router = require("express").Router();
const auth = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/register", auth.register);
router.post("/login", auth.login);
router.get("/profile", authMiddleware, auth.profile);

module.exports = router;
