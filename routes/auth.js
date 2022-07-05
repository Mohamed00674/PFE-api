const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const bcrypt = require("bcryptjs");
const auth = require("./middleware/verifyToken");
const { check, validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
const UserController = require("../controllers/user");

router.post(
  "/signup",
  [
    check("username", "username must be at least 3 characters")
      .exists()
      .isLength({ min: 3 }),
    check("email", "enter a valid email address").isEmail().normalizeEmail(),
    check("password", " password must be at least 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).jsonp(errors.array());
    }
    try {
      const { username, email, password } = req.body;

      if (!email || !password || !username) {
        return res.status(400).json({ error: "All inputs are required" });
      }
      const oldUser = await User.findOne({ email });

      if (oldUser) {
        return res
          .status(409)
          .json({ error: "User Already Exist. Please Login" });
      }

      const salt = await bcrypt.genSalt(10);
      const encryptedPassword = await bcrypt.hash(req.body.password, salt);
      const user = await User.create({
        username,
        email: email.toLowerCase(),
        password: encryptedPassword,
      });

      return res.status(201).json({ message: "Successfully registered" });
    } catch (err) {
      console.log(err);
    }
  }
);

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });
  if (!user)
    return res.status(400).json({ error: "email not found , please register" });
  if (user.role === "admin") {
    const Admintoken = jwt.sign(
      { _id: user._id, email },
      process.env.TOKEN_SECRET
    );
    res.redirect(`http://localhost:8082/admin?token=${token}`);
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).json({ message: "Email or Password  wrong" });
    const token = jwt.sign({ _id: user._id, email }, process.env.TOKEN_SECRET);
    return res.status(200).json({ message: "Logged In", token });
  }
});
router.get("/profile", auth, async (req, res) => {
  try {
    if (!req.user)
      return res.status(401).json({ message: "You are unauthorized" });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User does not exist" });

    return res.json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
});
router.delete("/:userId", UserController.user_delete);
router.put("/:id", UserController.user_update);
router.get("/users", UserController.all_users);

module.exports = router;
