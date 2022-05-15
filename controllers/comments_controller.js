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


//deleting the comment 
module.exports.destroy = function(req,res){
    //finding the comment by params
    Comment.findById(req.params.id,function(err,comment){
        //if post user is same as logged in user , then also he/she can delete the comment 
        Post.findById(comment.post,function(err,post){
               //if user of the comment is same as logged in user then only comment can be deleted
               if(comment.user==req.user.id || req.user.id==post.user){
               //saving post id to remove the comment from the array of comments from that particular post too 
              let postId=comment.post;
               comment.remove(); //removing the comment
               comment.save(); //saving the deletion of the comment
               //pulling out the comment from the comments array in post ,$pull is used to remove that particular comment  
              Post.findByIdAndUpdate(postId,{ $pull:{comments:req.params.id}},function(err,post){
                 return res.redirect('back');
               })
            }else{
            return res.redirect('back');
            }
      })
    })
}