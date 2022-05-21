//importing post schema 
const Post=require('../models/post');
//importing comment 
const Comment=require('../models/comment');
//creating a post
 //async is to tell that this function contains async code
module.exports.create= async function(req,res){
    // Post.create({ //creating an entry in db for posts 
    //    content: req.body.content ,
    //    user:req.user._id
    // },function(err,post){
    //     if(err){console.log('Error in creating post'); return;}
    //     return res.redirect('back'); 
    // });

    try{
        let post=await Post.create({ //creating an entry in db for posts 
            content: req.body.content ,
            user:req.user._id
         });
         //receiving the data through ajax
         if(req.xhr){ //check if the request is ajax request for home_posts.js
             return res.status(200).json({
                 data:{
                     post: post 
                 },
                 message:"Post created"
             });//return json with status
         }
         req.flash('success','Post created!');//for flash message
         return res.redirect('back'); 
    }catch(error){
        req.flash('error','Error in creating post');
        console.log(error);
        return res.redirect('back');
    }
    
}

//deleting a post
module.exports.destroy= async function(req,res){
 //checking whether the post exist or not
    //getting the id of the post through params
    // Post.findById(req.params.id,function(err,post){
    //     if(post){ //if post exist 
    //       //check if the user who is deleting the post is the creator of the post
    //       if(post.user == req.user.id){ //ideally _id should have been done but mongoose provides .id so id is directly converted to string, since ._id is of type objectId and .id is of type string 
    //            post.remove(); //removing post
    //           Comment.deleteMany({post:req.params.id},function(err){
    //               return res.redirect('back');
    //           })
    //       }else{
    //           return res.redirect('back');
    //       }
    //     }
    // })

    //async code  
    try{
    let post=await Post.findById(req.params.id);
    if(post){ //if post exist 
        //check if the user who is deleting the post is the creator of the post
        if(post.user == req.user.id){ //ideally _id should have been done but mongoose provides .id so id is directly converted to string, since ._id is of type objectId and .id is of type string 
             post.remove(); //removing post
            await Comment.deleteMany({post:req.params.id});

            //for ajax request from home_posts.js
             if(req.xhr){
                 
                 return res.status(200).json({
                     data:{
                        post_id:req.params.id
                     },
                     message:"Post deleted"
                 })
             }
            //flash message 
            req.flash('success','Post deleted');
            return res.redirect('back');
        }else{
            req.flash('error','you cannot delete this post');
            return res.redirect('back');
        }
      }
    }catch(error){
        req.flash('error',error);
        console.log(error);
        return;
    }
}
