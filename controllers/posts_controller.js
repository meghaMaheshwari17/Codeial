//importing post schema 
const Post=require('../models/post');
//importing comment 
const Comment=require('../models/comment');
//creating a post
module.exports.create= function(req,res){
    Post.create({ //creating an entry in db for posts 
       content: req.body.content ,
       user:req.user._id
    },function(err,post){
        if(err){console.log('Error in creating post'); return;}
        return res.redirect('back'); 
    });
}

//deleting a post
module.exports.destroy= function(req,res){
 //checking whether the post exist or not
    //getting the id of the post through params
    Post.findById(req.params.id,function(err,post){
        if(post){ //if post exist 
          //check if the user who is deleting the post is the creator of the post
          if(post.user == req.user.id){ //ideally _id should have been done but mongoose provides .id so id is directly converted to string 
               post.remove(); //removing post
              Comment.deleteMany({post:req.params.id},function(err){
                  return res.redirect('back');
              })
          }else{
              return res.redirect('back');
          }
        }
    })
}
