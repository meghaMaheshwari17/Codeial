//firing up express to get express.router to separate routes and controllers
const express = require('express');
const router = express.Router();
//importing home_controller
const homeController=require('../controllers/home_controller');

//using home_controller here
router.get('/',homeController.home); //home is the name of the exported function from the home controller
 
//making the user router avaialable here 
 //any request to /users will be forwarded to routes users.js, will work like /users/profile
router.use('/users',require('./users'));

//for any further routes you need to do something like this
 //router.use('/routerName',require('./fileName'));
//to request to /posts
router.use('/posts',require('./posts'));

//to request to /comments 
router.use('/comments',require('./comments'));

//for api
router.use('/api',require('./api'));

// for likes 
router.use('/likes',require('./likes'));
// for friendship 
router.use('/friends',require('./friendship'));
//exporting it to make it available to main index.js
module.exports=router;
