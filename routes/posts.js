//firing up express to get express.router to separate routes and controllers
const express = require('express');
const router = express.Router();

//accessing post controller
const postController =require('../controllers/posts_controller');
 
router.post('/create',postController.create);

//exporting it
module.exports=router;