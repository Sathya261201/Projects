const express = require("express");
const router = express.Router();
const User = require("../models/User");

// CREATE
router.post("/", async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.json({ message: "User added" });
});

// READ
router.get("/", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// UPDATE ✅
router.put("/:id", async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    email: req.body.email
  });
  res.json({ message: "User updated" });
});

// DELETE
router.delete("/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
});

module.exports = router;
