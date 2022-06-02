//api will have index and each version will have index.js
//all /api routes will come here
//firing up express to get express.router to separate routes and controllers
const express = require('express');
const router = express.Router();

//to make routes to v1 available
router.use('/v1',require('./v1'));


module.exports=router;