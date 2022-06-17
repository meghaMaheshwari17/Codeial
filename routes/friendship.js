//firing up express to get express.router to separate routes and controllers
const express = require('express');
const router = express.Router();

// accessing friendship controller
const friendshipController =require('../controllers/friends_controller');
 
router.get('/add',friendshipController.addFriends);

router.get('/delete',friendshipController.deleteFriend);
//exporting it
module.exports=router;
