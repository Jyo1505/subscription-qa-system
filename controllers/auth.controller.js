const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { email, password } = req.body;

  const bcrypt = require("bcryptjs");
  const db = require("../config/db");

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [email, hashedPassword],
      (err, result) => {
        if (err) {
          // ✅ Duplicate email error
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
              message: "User already exists"
            });
          }

          // Other DB errors
          return res.status(500).json({
            message: "Database error"
          });
        }

        // Assign FREE plan
        db.query(
          "INSERT INTO subscriptions (user_id, plan, daily_limit) VALUES (?, 'FREE', 1)",
          [result.insertId]
        );

        return res.status(201).json({
          message: "Registration successful"
        });
      }
    );
  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
};


exports.login = (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }

      // ❌ Email not found
      if (results.length === 0) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const user = results[0];

      // ❌ Wrong password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // ✅ Correct credentials
      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res.status(200).json({
        message: "Login successful",
        token
      });
    }
  );
};


exports.profile = (req, res) => {
  const db = require("../config/db");

  db.query(
    `SELECT u.email, s.plan, s.daily_limit, s.expires_at 
     FROM users u 
     JOIN subscriptions s ON u.id = s.user_id 
     WHERE u.id = ?`,
    [req.userId],
    (err, result) => {
      if (err || result.length === 0) {
        return res.status(500).json({ message: "Unable to fetch profile" });
      }
      res.json(result[0]);
    }
  );
};
