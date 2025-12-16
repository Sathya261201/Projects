const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "yourpassword",
  database: "admin_panel"
});

db.connect(err => {
  if (err) throw err;
  console.log("SQL Connected");
});

module.exports = db;
