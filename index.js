require("dotenv").config();
const cookieParser = require("cookie-parser");
const oauth = require("oauth");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
var etag = require("etag");
const fileUpload = require("express-fileupload");
const authRoute = require("./routes/auth");
const passport = require("passport");
const logger = require("morgan");
const path = require("path");
const fs = require("fs");
const instagram = require("./routes/instagram");
const facebook = require("./routes/facebook");
const twitter = require("./routes/twitter");
const linkedin = require("./routes/linkedin");
const image = require("./routes/imageUpload");
const file = require("./routes/fileUpload");
const app = express();

app.use(logger("dev"));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.disable("etag");
app.use(fileUpload());

app.use("/", facebook);
app.use("/", twitter);
app.use("/", linkedin);
app.use("/", instagram);
app.use("/", image);
app.use("/", file);

app.use(
  fileUpload({
    limits: {
      fileSize: 1024 * 1024, // 1 MBr
    },
    abortOnLimit: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use("/api", authRoute);

const dbURI = "mongodb://localhost:27017/myDatabase";

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on("error", (err) => {
  console.error(err);
});

db.once("open", () => {
  console.log("DB started successfully");
});

app.listen(2400, function () {
  console.log("Express server listening on port " + 2400);
});
