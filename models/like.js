// creating a schema for storing likes
const mongoose=require('mongoose');

const likeSchema=new mongoose.Schema({
    user:{  //need to store which user liked the post
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    // the object id on which like has been placed:- post or comment 
    likeable:{ 
         type:mongoose.Schema.Types.ObjectId,
         required:true,
         refPath: 'onModel'//we are going to place the path to some other field which is there
    },
    // defines type of object:- post or like , dynamically
    onModel:{
        type:String,
        required:true,
        enum:['Post','Comment'] //value in this field could be either post or comment and nothing other than that
    }
},{
    timestamps:true
})

const Like=mongoose.model('Like',likeSchema);
module.exports = Like;