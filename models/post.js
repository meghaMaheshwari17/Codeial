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
},{
    timestamps:true 
});

const Post = mongoose.model('Post',postSchema);
module.exports=Post;