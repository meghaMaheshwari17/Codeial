const Post=require('../../../models/post');
const Comment=require('../../../models/comment');
module.exports.index=async function(req,res){
    //getting post data from db and sending it as json
    //sending everything except password
    let posts=await Post.find({})
                   .sort('-createdAt')
                   .populate('user',['_id','email','name','createdAt','updatedAt','__v','avatar'])
                   .populate({
                       path:'comments',
                       populate:{
                           path:'user',
                           select:'_id email name createdAt updatedAt __v avatar'
                       }
                   });

    return res.json(200,{ //sending json data back
       message:"List of posts",
       posts:posts
    }) 
}


//deleting a post
module.exports.destroy= async function(req,res){
      
       try{
       let post=await Post.findById(req.params.id);
      
           //check if the user who is deleting the post is the creator of the post
        //    if(post.user == req.user.id){ //ideally _id should have been done but mongoose provides .id so id is directly converted to string, since ._id is of type objectId and .id is of type string 
                post.remove(); //removing post
               await Comment.deleteMany({post:req.params.id});
   
               //for ajax request from home_posts.js
            
               
               return res.json(200,{
                   message:'Post and comments deleteds'
               });
     
       }catch(error){
           return res.json(500,{
               message:'error'
           })
       }
   }