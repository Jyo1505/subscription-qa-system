require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth.routes");
const paymentRoutes = require("./routes/payment.routes");
const questionRoutes = require("./routes/question.routes");
// const aiRoutes = require("./routes/ai.routes");

const app = express();

/* ---------- MIDDLEWARE ---------- */
app.use(cors());
app.use(express.json());

/* ---------- SERVE FRONTEND ---------- */


app.use(express.static(path.join(__dirname, "../frontend")));

/* Default route */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

/* ---------- API ROUTES ---------- */
app.use("/api/auth", authRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/questions", questionRoutes);
// app.use("/api/ai", aiRoutes);

/* ---------- SERVER ---------- */
const PORT = process.env.PORT || 1000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
