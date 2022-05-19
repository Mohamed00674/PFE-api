require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoute = require("./routes/auth");
const passport = require("passport");
const session = require("express-session");
const FacebookStrategy = require("passport-facebook").Strategy;
const logger = require("morgan");

const User = require("./model/User");

const app = express();

app.use(logger("dev"));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "SECRET",
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});


let isStrategySetup = false;
function setupStrategy(){
  return function(req, res, next){
      if(!isStrategySetup){
          passport.use(new FacebookStrategy({
            clientID: "285508587122471",
            clientSecret: "f86b30855418ec475a6a727a69d1ef26",
            callbackURL: "http://localhost:2400/auth/facebook/callback",
              },
              function (accessToken, refreshToken, profile, done) { 
                  process.nextTick(function () {
                    User.findByIdAndUpdate(req.query.id, {
                      facebookName: profile.displayName,
                      facebookAccessToken: accessToken,
                    }, (err, user) => {
                      done(err, user)
                    });
                  });    
              }
          ));
          isStrategySetup = true;
      }

      next();
  };
}

app.get(
  "/auth/facebook",
  setupStrategy(),
  passport.authenticate("facebook", {
    scope: [
      "public_profile",
      "email",
      "pages_manage_posts",
    ],
  })
);

app.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "http://localhost:8081/",
    failureRedirect: "http://localhost:8081/basic/facebook",
  })
);

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
