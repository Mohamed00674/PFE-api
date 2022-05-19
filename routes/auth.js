const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const bcrypt = require("bcryptjs");
const auth = require("./middleware/verifyToken");
const passport = require('passport');

router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ error: "All inputs are required" });
    }
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).json({ error: "User Already Exist. Please Login" });
    }

    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(req.body.password, salt);
    const user = await User.create({
      username,
      email: email.toLowerCase(),
      password: encryptedPassword,
    });

    return res.status(201).json({ message: "user has  been created" });
  } catch (err) {
    console.log(err);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });
  console.log(user);
  if (!user) return res.status(400).json({ message: "User not found" });
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).json({message : "Invalid password"});
  const token = jwt.sign({ _id: user._id, email }, process.env.TOKEN_SECRET);
  return res.status(200).json({
    token,
  });
});

router.get("/dashboard", auth, (req, res) => {
  res.status(200).send("welcome");
});

module.exports = router;
