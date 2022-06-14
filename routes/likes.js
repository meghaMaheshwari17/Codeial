//firing up express to get express.router to separate routes and controllers
const express = require('express');
const router = express.Router();
//importing likes_controller
const likesController = require('../controllers/likes_controller');

router.post('/toggle',likesController.toggleLike);



module.exports=router;