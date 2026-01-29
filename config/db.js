const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "152005",
  database: "stackoverflow_clone"
});

db.connect(err => {
  if (err) {
    console.error("DB Error:", err);
    return;
  }
  console.log("MySQL Connected");
});

module.exports = db;
