//setting up passport js 
const passport=require('passport');
//strategy property from passport-local
const LocalStrategy = require('passport-local').Strategy;

const User=require('../models/user');

//need to tell passport to use this localStrategy property for authentication
passport.use(new LocalStrategy(
   {
    usernameField:'email'
   },
   function(email,password,done){//callback function
      //find a user and establish the identity
      User.findOne({email:email},function(err,user){/*right email is the value which is passed on*/
          if(err){
              console.log('error in finding user -->Passport');
              return done(err); //will report an error to passport
            }

            if(!user || user.password!=password){ //if user is not found or password passed on doesn't match
             console.log('Invalid Username/Password');
             return done(null,false);//first argument is error but there is none here, but the authentication is not done so second argument is false
            }

            return done(null,user); //if user is authenticated
      })
   }
))

//serialize user function:- need to put user id into the cookie and not the whole info because that is only thing you need to encrypt
//serializing the user to decide which key is to be kept in the cookie
passport.serializeUser(function(user,done){
    done(null,user.id);
})

//deserialize user function:- when the cookie is sent back to the server and we are establishing the identity of which user is there from the database we are using that id to find the user 
//deserializing the user from the key in the cookies
passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        if(err){
            console.log('error in finding user -->Passport');
             return done(err);
        }
        return done(null,user);
    })
});

// to send user data to views
//  check if the user is authenticated
  //we made the function checkAuthentication to be used as middleware
passport.checkAuthentication=function(req,res,next){
   if(req.isAuthenticated()){//checks whether the user is authenticated or not
        return next(); //then passing onto next function 
   }
   //if the user is not authenticated
   return res.redirect('/users/sign-in');
}

//set the user for the views 
passport.setAuthenticatedUser=function(req,res,next){
    if(req.isAuthenticated()){
        //req.user contains the current signed in user info from the session cookie and we are just sending this to the locals for the views 
        res.locals.user=req.user;
    } 
    next();
}



module.exports =passport;