const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

// Routes
app.use("/api/users", require("./routes/users"));

app.listen(3000, () => {
  console.log("REST API running on http://localhost:3000");
});
