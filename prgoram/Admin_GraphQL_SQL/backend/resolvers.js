const db = require("./db");

module.exports = {
  Query: {
    users: () => {
      return new Promise((resolve, reject) => {
        db.query("SELECT * FROM users", (err, results) => {
          if (err) reject(err);
          resolve(results);
        });
      });
    }
  },

  Mutation: {
    addUser: (_, { name, email }) => {
      return new Promise((resolve, reject) => {
        db.query(
          "INSERT INTO users (name, email) VALUES (?, ?)",
          [name, email],
          err => {
            if (err) reject(err);
            resolve("User added");
          }
        );
      });
    },

    deleteUser: (_, { id }) => {
      return new Promise((resolve, reject) => {
        db.query(
          "DELETE FROM users WHERE id = ?",
          [id],
          err => {
            if (err) reject(err);
            resolve("User deleted");
          }
        );
      });
    }
  }
};
