//firing up express to get express.router to separate routes and controllers
const express = require('express');
const router = express.Router();
const passport = require('passport');
//all /api/v1/posts routes will come here
const postsApi=require('../../../controllers/api/v1/posts_api');
router.get('/',postsApi.index);

//to put a check over deleting the posts
//setting false to not let session cookie get generated
router.delete('/:id',passport.authenticate('jwt',{session:false}),postsApi.destroy);


module.exports=router;