//firing up express to get express.router to separate routes and controllers
const express = require('express');
const router = express.Router();
 
//all /api/v1 routes will come here 


router.use('/posts',require('./posts'));

router.use('/users',require('./users'));

module.exports=router;