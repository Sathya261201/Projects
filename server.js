import express from "express";
import cors from "cors";
import { promisify } from "util";
import path from "path";
import { fileURLToPath } from "url";
import db from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

// serve the frontend `index.html` from this folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(__dirname));

const query = promisify(db.query).bind(db);

const logReq = (req) =>
  console.log(`${req.method} ${req.originalUrl} from ${req.ip}`, {
    body: req.body,
    params: req.params,
    query: req.query,
    userAgent: req.headers["user-agent"],
  });

// CREATE (POST)
app.post("/users", async (req, res) => {
  logReq(req);
  const { name, email } = req.body || {};
  if (!name || !email) return res.status(400).json({ error: "Missing name or email" });

  try {
    const result = await query("INSERT INTO users (Name, Email) VALUES (?, ?)", [name, email]);
    res.status(201).json({ id: result.insertId, message: "User created" });
  } catch (err) {
    res.status(500).json({ error: err?.message || err });
  }
});

// READ (GET all)
app.get("/users", async (req, res) => {
  logReq(req);
  try {
    const rows = await query("SELECT ID AS id, Name AS name, Email AS email FROM users");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err?.message || err });
  }
});

// READ (GET by id)
app.get("/users/:id", async (req, res) => {
  logReq(req);
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid id" });

  try {
    const rows = await query("SELECT ID AS id, Name AS name, Email AS email FROM users WHERE ID=?", [id]);
    if (!rows || rows.length === 0) return res.status(404).json({ error: "User not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err?.message || err });
  }
});

// UPDATE (PUT)
app.put("/users/:id", async (req, res) => {
  logReq(req);
  const id = parseInt(req.params.id, 10);
  const { name, email } = req.body || {};
  if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid id" });
  if (!name || !email) return res.status(400).json({ error: "Missing name or email" });

  try {
    const result = await query("UPDATE users SET Name=?, Email=? WHERE ID=?", [name, email, id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User updated" });
  } catch (err) {
    res.status(500).json({ error: err?.message || err });
  }
});

// DELETE
app.delete("/users/:id", async (req, res) => {
  logReq(req);
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid id" });

  try {
    const result = await query("DELETE FROM users WHERE ID=?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err?.message || err });
  }
});

// Server
app.listen(3000, () => console.log("Server running on port 3000"));
