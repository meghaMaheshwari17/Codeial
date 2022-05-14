//firing up express to get express.router to separate routes and controllers
const express = require('express');
const passport = require('passport');
const router = express.Router();

//accessing comment controller
const commentsController =require('../controllers/comments_controller');
 
//passport.checkAuthentication so that unauthenticated users can not comment
router.post('/create',passport.checkAuthentication,commentsController.create);

//exporting it
module.exports=router;