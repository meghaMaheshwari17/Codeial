//firing up express to get express.router to separate routes and controllers
const express = require('express');
const router = express.Router();

//all /api/v1/posts routes will come here
const postsApi=require('../../../controllers/api/v1/posts_api');
router.get('/',postsApi.index);

router.delete('/:id',postsApi.destroy);


module.exports=router;