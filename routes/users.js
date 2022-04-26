//firing up express to get express.router to separate routes and controllers
const express = require('express');
const router = express.Router();
//importing user controller 
const usersController=require('../controllers/users_controller');
//making the get request
router.get('/',usersController.profile);
//exporting it to routes index.js
module.exports=router;