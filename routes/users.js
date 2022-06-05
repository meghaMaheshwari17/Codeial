//firing up express to get express.router to separate routes and controllers
const express = require('express');
const router = express.Router();

//importing passport to do authetication 
const passport = require('passport');
//importing user controller 
const usersController=require('../controllers/users_controller');
//making the get request
//router.get('/profile',usersController.profile);

//making the get request for /profile only if user is Authenticated
router.get('/profile/:id', passport.checkAuthentication, usersController.profile);


//making get request for signup
router.get('/sign-up',usersController.signUp);
//making get request for sign in
router.get('/sign-in',usersController.signIn);

//making post request from sign up page to create user 
router.post('/create',usersController.create);

//making get request for sign-out 
router.get('/sign-out',usersController.destroySession);

//manual authentication
//making post request from sign in page to createSession
//router.post('/createSession',usersController.createSession);

//passport js authetication for sign in page
router.post('/create-session',passport.authenticate(
    'local', //stragtegy
    {failureRedirect:'/users/sign-in'}, //if the user fails to sign in
),usersController.createSession);

//to update user info 
router.post('/update/:id',passport.checkAuthentication, usersController.update);

//this url is given by passport and google will automatically recognize that request is coming from this
//the first route from which we will send the request to google to authenticate the user
router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}));  //first argument is the strategy and second argument is scope which is the info we are looking to fetch

//the second route which will google return after authentciating the user:- callback url 
router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/users/sign-in'}),usersController.createSession);


//exporting it to routes index.js
module.exports=router;