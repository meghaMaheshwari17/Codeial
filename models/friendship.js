//creating a schema for comments:-
const mongoose=require('mongoose');

// friendship schema to establish the friends
const friendshipSchema = new mongoose.Schema({
    // the user who sent the request of friendship 
    from_user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    to_user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
},{
    timestamps:true
})

const Friendship=mongoose.model('Friendship',friendshipSchema);

module.exports = Friendship;