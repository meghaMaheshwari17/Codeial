const Like= require('../models/like');
const Comment= require('../models/comment');
const Post= require('../models/post');

// action that will toggle the like button :- create when it doesn't exist and delete when it exists  
module.exports.toggleLike=async function(req,res){
    try{
        // our url will be:- likes/toggle/?id=dfef&type=Post
        let likeable; //decides if the like belongs to the comment or post
        let deleted=false; //if deleted is false we will increase the count of likes +1 and if deleted is true we will decrease the likes by -1
        if(req.query.type=='Post'){
            // finding that post and populating it to show if it contains more likes
            likeable=await Post.findById(req.query.id).populate('likes');
        }else{
            likeable=await Comment.findById(req.query.id).populate('likes');
        }
        // check if a like already exists 
        let existingLike=await Like.findOne({
            likeable:req.query.id,
            onModel:req.query.type,
            user:req.user._id
        });
        // if a like already exists then delete it , if not create it
        if(existingLike){
            // so to delete it, we have to delete it from likeable object also, that is post or comment
            likeable.likes.pull(existingLike._id); //pulling the like from the like array
            likeable.save(); 
            existingLike.remove(); //then removing it in Like 
            deleted=true; //remove the like
        }else{ //make one if doesn't exist 

            let newLike=await Like.create({
                user:req.user._id, 
                likeable:req.query.id, 
                onModel:req.query.type
            });
            //put this newly crated like in the array of likeable:- post or comment
            likeable.likes.push(newLike._id);
            likeable.save();
        }

        return res.json(200,{
            message:'request successful',
            data:{  //sending this data to toggle_likes.js for ajax request to see if we have to increase the like count or decrease it
                deleted:deleted 
            }
        })
    }catch(err){
        console.log(err);
        return res.json(500,{
            message:'Internal server error'
        });
    }
}