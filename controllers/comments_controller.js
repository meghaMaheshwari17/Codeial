const Comment = require('../models/comment');
const Post = require('../models/post');
const User = require('../models/user');


//creating the comments 
module.exports.create = function(req,res){
    //to create a comment we have to first see if the post exist or not
  Post.findById(req.body.post,function(err,post){
      if(post){ //if the post exist then create the comment
          Comment.create({
             content:req.body.content,
             post:req.body.post,
              user:req.user._id
          },function(err,comment){
              //adding comment to the post in the comments array
              post.comments.push(comment); //updating post in the mongodb 
              post.save(); //whenever something gets updated you have to call .save() after it to properly save it in db
              res.redirect('/');
          })
      }
  })

}