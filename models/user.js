// creating schema for storing user info 
const mongoose=require('mongoose');

//importing multer for profile picture upload 
const multer = require('multer');
//requiring path where the file uploaded will be stored 
const path = require('path');
const AVATAR_PATH=path.join('/uploads/users/avatars'); //path where avatars will be stored
//in user schema we will define path for avatars so that the path of where the file is stored can be stored in db
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
      },
    avatar:{
        type:String
      },
      // keeping an array of the friends 
     friendships:[
      {
      type:mongoose.Schema.Types.ObjectId,
        ref:'Friendship'
      }
     ]
    },
    {
        timestamps:true //will store when the user was created and updated
    });

    //taken from multer documentation
    //making sure that our path gets saved in db and our file upload gets saved in our path 
    let storage = multer.diskStorage({
        destination: function (req, file, cb) {  //request, file from that request, and callback function
          cb(null, path.join(__dirname,'..',AVATAR_PATH)) //first argument is null and second argument is exact path where file will be stored
          //first argument is considered error , so if you pass anything other than null then it means request was unsuccessfull 
        },
        filename: function (req, file, cb) { //defines the name of the file
          // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
          cb(null, file.fieldname + '-' + Date.now()) //file will be stored as avatar-date.now()
        }
      });


      //static functions 
      //now to assign the storage defined to multer
      userSchema.statics.uploadedAvatar=multer({storage:storage}).single('avatar'); //.single makes sure that only one file will be uploaded for fieldname avatar
      //I need avatar_path to be avaialable publicly for user model
      userSchema.statics.avatarPath=AVATAR_PATH;

    const User=mongoose.model('User',userSchema);

    module.exports=User;