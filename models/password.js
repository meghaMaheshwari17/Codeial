//creating a schema for resetting password so that we can check its acessToken and not let user acess it again and again:-
const mongoose=require('mongoose');

const passwordSchema= new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'  
      },
    accessToken:{
        type:String,
        required:true
    },
    isValid:{
        type:String,
        required:true,
        default:true
    }
},{
    timestamps:true
})

const Password=mongoose.model('Password',passwordSchema);
module.exports = Password;