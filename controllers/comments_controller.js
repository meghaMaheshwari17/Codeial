const Comment = require('../models/comment');
const Post = require('../models/post');
const User = require('../models/user');
const Like = require('../models/like');
//to send emails whenevr someone comments 
const commentsMailer = require('../mailers/comments_mailer');
//importing queue 
const queue = require('../config/kue');
//importing comment email worker and queue for mails 
const commentEmailWorker = require('../workers/comment_email_worker');
//creating the comments 
module.exports.create = async function(req,res){
    //to create a comment we have to first see if the post exist or not
//   Post.findById(req.body.post,function(err,post){
//       if(post){ //if the post exist then create the comment
//           Comment.create({
//              content:req.body.content,
//              post:req.body.post,
//               user:req.user._id
//           },function(err,comment){
//               //adding comment to the post in the comments array
//               post.comments.push(comment); //updating post in the mongodb 
//               post.save(); //whenever something gets updated you have to call .save() after it to properly save it in db
//               res.redirect('/');
//           })
//       }
//   })

//async code 
try{  //try catch is imp for async await 
let post=await Post.findById(req.body.post);
 if(post){ //if the post exist then create the comment
    let comment=await Comment.create({
       content:req.body.content,
       post:req.body.post, //post id
        user:req.user._id  //user id making the request
    });

     //adding comment to the post in the comments array
     post.comments.push(comment); //updating post in the mongodb 
     
     post.save(); //whenever something gets updated you have to call .save() after it to properly save it in db
    //  await Comment.find({})
    //         .sort('-createdAt')
            
     //for ajax request 
     comment = await comment.populate('user', 'name email'); //populating user
     //to send emails 
    //  commentsMailer.newComment(comment);
    //using queue to send emails:- creating the job in the queue , if there is no queue it will create one
    let job=queue.create('emails',comment).save(function(err){
        if(err){console.log('error in creating the queue',err);return;}
        console.log('job enqueued:',job.id); //it is available with every job  
    });
     
    if(req.xhr){ //if request is ajax 
        
        return res.status(200).json({
            data:{
                commentData:comment
            },
            message:"Comment created successfully from ajax!"
        });
     }
     
     req.flash('success','comment created!');
     return res.redirect('/');
 }
}catch(err){
    req.flash('error',err);
    console.log(err);
    return;
}

}


//deleting the comment 
module.exports.destroy = async function(req,res){
    //finding the comment by params
    // Comment.findById(req.params.id,function(err,comment){
    //     //if post user is same as logged in user , then also he/she can delete the comment 
    //     Post.findById(comment.post,function(err,post){
    //            //if user of the comment is same as logged in user then only comment can be deleted
    //            if(comment.user==req.user.id || req.user.id==post.user){
    //            //saving post id to remove the comment from the array of comments from that particular post too 
    //           let postId=comment.post;
    //            comment.remove(); //removing the comment
    //            comment.save(); //saving the deletion of the comment
    //            //pulling out the comment from the comments array in post ,$pull is used to remove that particular comment  
    //           Post.findByIdAndUpdate(postId,{ $pull:{comments:req.params.id}},function(err,post){
    //              return res.redirect('back');
    //            })
    //         }else{
    //         return res.redirect('back');
    //         }
    //   })
    // })

    //async code
    try{
    let comment=await Comment.findById(req.params.id);
    let post=await Post.findById(comment.post);
    //if user of the comment is same as logged in user then only comment can be deleted
    if(comment.user==req.user.id || req.user.id==post.user){
        //saving post id to remove the comment from the array of comments from that particular post too 
       let postId=comment.post;
        comment.remove(); //removing the comment
       // comment.save(); //saving the deletion of the comment
    //    deleting the likes of that post too 
         await Like.deleteMany({likeable:comment,onModel:'Comment'});
        //pulling out the comment from the comments array in post ,$pull is used to remove that particular comment  
       post=await Post.findByIdAndUpdate(postId,{ $pull:{comments:req.params.id}});

       //for ajax request 
       if(req.xhr){
           return res.status(200).json({ 
            data: {
                comment_id: req.params.id
            },
            message: "Comment deleted from ajax!"
           })
       }

       req.flash('success','Comment deleted!');
       return res.redirect('back');
     }else{
        req.flash('error','Comment cannot be deleted');
     return res.redirect('back');
     }
    }catch(err){
        req.flash('error',err);
        console.log(err);
        return;
    }
}