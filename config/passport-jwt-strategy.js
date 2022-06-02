//importing passport 
const passport = require('passport');

const JWTStrategy=require('passport-jwt').Strategy;

//a module which will help us to extract jwt from header 
const ExtractJWT=require('passport-jwt').ExtractJwt;

//whenever we are going to establish the identity of the user we are going to need user module
const User=require('../models/user');

//key is to be present to encrypt any text and decrypt it back
let opts={
    jwtFromRequest:ExtractJWT.fromAuthHeaderAsBearerToken, //header is a list of keys, it has a key called authorization, that is also a list of keys, that can have a key called bearer, which will have the jwt token, so we will be able to extract from authorisation header  
    secretOrKey:'codeial' //encryption or decryption string 
}

//tell passport to use jwt strategy 
passport.use(new JWTStrategy(opts,function(jwtPayLoad,done){
    //finding the user in database 
    User.findById(jwtPayLoad._id,function(err,user){
        if(err){console.log('error in finding user from jwt');return;}
        //we are matching the jwt thing
        //here user is already present in the jwt, we are just fetching out the id from the payload and checking if the user is there or not
        if(user){
            return done(null,user);
        }else{
            return done(null,false); //user was not found in the db
        }
    })
})) //the function reads the data from jwt payload, cuz payload contains the info of the user


module.exports=passport;