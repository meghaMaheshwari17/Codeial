//importing user schema from models/user
const User = require('../models/user');
//will controller multiple users 
module.exports.profile = function(req,res){
   return  res.render('user_profile',{title:'user'})
}
//rendering signup page
module.exports.signUp=function(req,res){
   return res.render('user_signup',{title:'codeial:Sign Up'})
}

//rendering signin page
module.exports.signIn=function(req,res){
   return res.render('user_signin',{title:'codeial:Sign In'})
}

//getting the signup data from signup page
module.exports.create=function(req,res){
   //checking if password and confirm password are same
  if(req.body.password!=req.body.confirm_password){
     console.log('Enter correct password');
     return res.redirect('back');
  }
  User.findOne({email:req.body.email},function(err, user){
     if(err){console.log('finding user in signing up failed');return;}
     
     if(!user){//if user is not present in the database
        User.create(req.body,function(err, user){
           if(err){console.log('creating user failed');return;}
           return res.redirect('/users/sign-in');
        })
     }else{ //if user is present in the database 
        return res.redirect('back');
     }
  })
}  


//getting the sign in session data from signup page
module.exports.createSession=function(req,res){
   //later
}
