import mysql from "mysql2";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",     // your MySQL password
  database: "mydb"      // make sure this DB exists
});

// DEBUG LOGS HERE 👇
db.connect((err) => {
  if (err) {
    console.log("MySQL Connection Failed ❌");
    console.log(err);     // detailed error output
  } else {
    console.log("MySQL Connected Successfully ✔");
  }
});

export default db;

