// creating schema for storing user info 
const mongoose=require('mongoose');
const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true, //email is a required property
        unique:true //should be unique 
    },
    password:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
      }
    },{
        timestamps:true //will store when the user was created and updated
    });

    const User=mongoose.model('User',userSchema);

    module.exports=User;