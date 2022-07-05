const FacebookStrategy = require("passport-facebook").Strategy;
const passport = require("passport");
const express = require("express");
const Router = express.Router();
const User = require("../model/User");

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

let isStrategySetup = false;
function setupStrategy() {
  return function (req, res, next) {
    if (!isStrategySetup) {
      passport.use(
        new FacebookStrategy(
          {
            clientID: "285508587122471",
            clientSecret: "f86b30855418ec475a6a727a69d1ef26",
            callbackURL: "http://localhost:2400/auth/facebook/callback",
            profileFields: ["name", "picture.type(large)"],
          },
          function (accessToken, refreshToken, profile, done) {
            process.nextTick(function () {
              User.findByIdAndUpdate(
                req.query.id,
                {
                  facebookName: profile.displayName,
                  facebookAccessToken: accessToken,
                  facebookimage: profile.photos[0].value,
                },
                (err, user) => {
                  done(err, user);
                }
              );
            });
            console.log("token" + " " + accessToken);
            console.log("this is profile" + profile);
          }
        )
      );
      isStrategySetup = true;
    }
    next();
  };
}

Router.get(
  "/auth/facebook",
  setupStrategy(),
  passport.authenticate("facebook", {
    scope: ["public_profile", "email", "pages_manage_posts"],
  })
);

Router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "http://localhost:8081/basic/facebook",
    failureRedirect: "http://localhost:8081/error-pages/error-404",
  })
);

Router.get("/token/:id", async (req, res) => {
  try {
    if (!req.params) res.json({ error: "Missing user data" });
    if (!req.params.id) res.json({ error: "Missing user data" });
    const user = await User.findOne({ _id: req.params.id });
    if (!user) res.json({ error: "no user found" });
    return res.status(200).json({ user });
  } catch (err) {
    return res.status(err.status).json({ message: "can't get the user" });
  }
});
module.exports = Router;
