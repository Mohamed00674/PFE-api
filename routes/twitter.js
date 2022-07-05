const TwitterStrategy = require("passport-twitter").Strategy;
const passport = require("passport");
const express = require('express');
const session = require("express-session");
const router = express.Router();


router.use(session({
    resave: false,
    saveUninitialized: true,
    secret: "SECRET",
  })
);
passport.use(new TwitterStrategy({
  consumerKey:    "OMyVhqwMgNBEJxni8Hnt86xnp",
  consumerSecret: "7YIz0etbqM8Bp8J6X1pY90f9swNH6OZAFCtRapqFaTxfxDttgB",
  callbackURL:    "http://localhost:2400/auth/twitter/callback"
},
  function(token, tokenSecret, profile, done) {
    console.log(profile);
    console.log(token);
    console.log(tokenSecret);
    done(null, profile);
  }
));
passport.serializeUser(function(user, callback){
    callback(null, user);
  });
  passport.deserializeUser(function(object, callback){
    callback(null, object);
  });
  router.get('/twitter/login', passport.authenticate('twitter'));
  
  router.get('/auth/twitter/callback', passport.authenticate('twitter', {
    failureRedirect : 'http://localhost:8081/error-pages/error-404'
  }), 
    function(req, res){
      res.redirect('http://localhost:8081/basic/twitter')
    });


    module.exports = router