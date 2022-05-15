//firing up express to get express.router to separate routes and controllers
const express = require('express');
const passport = require('passport');
const router = express.Router();

//accessing post controller
const postController =require('../controllers/posts_controller');
 
//passport.checkAuthentication so that unauthenticated users can not post on home 
router.post('/create',passport.checkAuthentication,postController.create);

//router for deleting the post 
router.get('/destroy/:id',passport.checkAuthentication,postController.destroy);
//exporting it
module.exports=router;