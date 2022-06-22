//firing up express to get express.router to separate routes and controllers
const express = require('express');
const passport = require('passport');
const router = express.Router();

const chatController=require('../controllers/chat_controller');

router.post('/send',chatController.creatingChat);

module.exports=router;