//creating schema for individual posts 
const mongoose=require('mongoose');

const postSchema=new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    user:{ //this post will be linked to a user
       type:mongoose.Schema.Types.ObjectId, //will refer to user's schema
       ref:'User' //User is the shema we are refering to
    },
    //include the array of ids of comments so that fetching of comments on a post will be faster
    //instead of going to each comment and finding out where postid is this post, we are already populating post with comments whose postid matches with this post   
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId, //will refer to comments's schema
            ref:'Comment'   
        }
    ]
},{
    timestamps:true 
});

const Post = mongoose.model('Post',postSchema);
module.exports=Post;