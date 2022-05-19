const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const authRoute = require("./routes/auth");
const dotenv = require("dotenv");
const session = require("express-session");
passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const Pusher = require("pusher");

dotenv.config();
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use("/api", authRoute);

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
});
const dbURI = "mongodb://localhost:27017/myDatabase";

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on("error", (err) => {
  console.error(err);
});
db.once("open", () => {
  console.log("DB started successfully");
});
app.listen(2400, () => {
  console.log("Server started: 2400");
});
