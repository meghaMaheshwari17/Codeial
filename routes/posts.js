//firing up express to get express.router to separate routes and controllers
const express = require('express');
const router = express.Router();

//accessing post controller
const postController =require('../controllers/post_controller');

router.get('/',postController.post);

//exporting it
module.exports=router;