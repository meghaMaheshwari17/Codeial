//social authentication with google using passport
const passport = require('passport');
const googleStrategy=require('passport-google-oauth').OAuth2Strategy;
//for generating unique passwords
const crypto=require('crypto');
const env=require('./environment');
const User=require('../models/user');

//we need to tell passport to use google strategy 
passport.use(new googleStrategy({
    clientID:env.google_clientID, //taken from console.developers.google.com credentials
    clientSecret:env.google_clientSecret,
    callbackURL:env.google_callbackURL
   },
   //callback function 
   function(accessToken, refreshToken,profile,done){ //if accessToken expires, we use refresh token to get another token, without asking user to sign in
     //profile would contain user's info , so we are going to match user info with email in db
      User.findOne({email:profile.emails[0].value}).exec(function(err,user){  //profile.emails is array cuz there can be multiple accounts on google of one user
          if(err){console.log('error in google strategy passport');return;}
          console.log(profile); 
          if(user){ //if user exists return the user
              return done(null,user);
          }else{  //if the user doesn't exist in the db  then create it 
              User.create({
                  name:profile.displayName,
                  email:profile.emails[0].value,
                  password:crypto.randomBytes(20).toString('hex'), //crypto will generate random password
              },function(err,user){
                  if(err){console.log("error in creating user in google stategy");return;}
                  return done(null,user); //if user gets created return it
              })
          }
      })
    }

    ));

module.exports =passport;