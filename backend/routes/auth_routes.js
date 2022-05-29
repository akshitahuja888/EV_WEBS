const express = require('express');
const LocalStrategy = require('passport-local');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const router = require('router');
const User = require('../models/User.js');
const mongoose = require("mongoose");

//THE LOCAL MONGOOSE CONTAINS THIS AS A PRE-DEFINDE FUNCTION ALREADY 
// passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
});
 
  passport.use(new GoogleStrategy({
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "api/auth/google/callback",
      userProfileURL:"https://www.googleapis.com/oauth2/v3/userinfo"
    },
        function(accessToken, refreshToken, profile,cb) {
          //check user table for anyone with a facebook ID of profile.id
          console.log(profile);
          // console.log(email);
          User.findOne({
             emailId: profile.emails[0].value
          }, function(err, user) {
              if (err) {
                  return cb(err);
              }
              //No user was found... so create a new user with values from Facebook (all the profile. stuff)
              if (!user) {
                  user = new User({
                      username: profile.displayName,
                      emailId: profile.emails[0].value,
                      provider: 'google',
                      //now in the future searching on User.findOne({'facebook.id': profile.id } will match because of this next line
                      google: profile._json
                  });
                  console.log(user);
                  user.save(function(err) {
                      if (err) console.log(err);
                      return cb(err, user);
                  });
              } else {
                  //found user. Return
                  console.log(user);
                  return cb(err, user);
              }
          });
      }
  ));

  router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/api/' }),
  function(req, res) {
      console.log('reached authentication')
      res.redirect('/campgrounds');
  });
  

   router.get('/google',passport.authenticate('google', { scope: ['profile','email'] }));

module.exports = router;



