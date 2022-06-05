//firing up express to get express.router to separate routes and controllers
const express = require('express');
const router = express.Router();

const usersApi=require('../../../controllers/api/v1/users_api');
//all /api/v1/users routes will come here

router.use('/create-session',usersApi.createSession);


module.exports=router;