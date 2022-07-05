var LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
const passport = require("passport");
const express = require("express");
const router = express.Router();
const User = require("../model/User");

passport.use(
  new LinkedInStrategy(
    {
      clientID: "78gpgomu718n7p",
      clientSecret: "fSLChB7pg39Heq7j",
      callbackURL: "http://localhost:2400/auth/linkedin/callback",
      scope: [
        "r_emailaddress",
        "r_liteprofile",
        "w_organization_social",
        "w_member_social",
        "r_organization_social",
        "r_member_social",
        "r_compliance",
        "w_compliance",
      ],
    },
    function (accessToken, refreshToken, profile, done) {
      var searchQuery = {
        linkedinName: profile.displayName,
      };

      var updates = {
        linkedinName: profile.displayName,
        linkedinId: profile.id,
        linkedinAccessToken: accessToken,
      };
      var options = {
        upsert: true,
      };
      User.findOneAndUpdate(
        searchQuery,
        updates,
        options,
        function (err, user) {
          if (err) {
            return done(err);
          } else {
            return done(null, user);
          }
        }
      );
    }
  )
);
router.get(
  "/auth/linkedin",
  passport.authenticate("linkedin", {
    scope: ["r_emailaddress", "r_liteprofile"],
  })
);
router.get(
  "/auth/linkedin/callback",
  passport.authenticate("linkedin", {
    successRedirect: "http://localhost:8081/basic/linkedin",
    failureRedirect: "http://localhost:8081/error-pages/error-404",
  })
);
router.get("/linkedin/", async (req, res) => {
  try {
    const linkedUser = await User.findOne({ linkedinId: "JqCni5imEx" });
    if (!linkedUser)
      return res.status(404).json({ message: "User does not exist" });
    return res.json(linkedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
});
module.exports = router;
