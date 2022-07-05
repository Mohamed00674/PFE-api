const InstagramStrategy = require("passport-instagram");
const passport = require("passport");
const express = require("express");
const router = express.Router();
const User = require("../model/User");
passport.use(
  new InstagramStrategy(
    {
      clientID: "388858809847337",
      clientSecret: "170e7b784db7e2e38d115ebbeec688b5",
      callbackURL: "http://localhost:2400/auth/instagram/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      return done(err, user);
    }
  )
);
router.get("/auth/instagram/", passport.authenticate("instagram"));

router.get(
  "/auth/instagram/callback",
  passport.authenticate("instagram", {
    failureRedirect: "http://localhost:8081/error-pages/error-404",
  }),
  function (req, res) {
    res.redirect("http://localhost:8081/basic/instagram");
  }
);

module.exports = router;
