//firing up express to get express.router to separate routes and controllers
const express = require('express');
const router = express.Router();
//importing user controller 
const usersController=require('../controllers/users_controller');
//making the get request
router.get('/',usersController.profile);

//making get request for signup
router.get('/sign-up',usersController.signUp);
//making get request for sign in
router.get('/sign-in',usersController.signIn);

//making post request from sign up page to create user 
router.post('/create',usersController.create);

//exporting it to routes index.js
module.exports=router;