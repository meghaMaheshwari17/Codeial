//firing up express to get express.router to separate routes and controllers
const express = require('express');
const router = express.Router();
//importing home_controller
const homeController=require('../controllers/home_controller');

//using home_controller here
router.get('/',homeController.home); //home is the name of the exported function from the home controller



//exporting it to make it available to main index.js
module.exports=router;
