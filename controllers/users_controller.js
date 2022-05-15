//importing user schema from models/user
const User = require('../models/user');
//will controller multiple users 
module.exports.profile = function(req,res){
   // if(req.cookies.user_id){ //if user_id is present in the cookies or not
   //    User.findOne({_id:req.cookies.user_id},function(err, user){
   //       if(err){console.log('Error in finding profile of the user'); return;}
   //       if(user){//if user is found
         //   return  res.render('user_profile',{title:'User Profile',name:user.name});
   //       }else{
   //          return res.render('/users/sign-in');
   //       }
   //    })
   // }else{//if user_id is not present in the cookies
   //    return res.redirect('/users/sign-in');
   // }
   User.findById(req.params.id,function(err, user){
      return res.render('user_profile', {
         title: 'User Profile',
         profile_user:user
     })
   })
   
}

//rendering signup page
module.exports.signUp=function(req,res){
   if(!req.isAuthenticated()){//if user is not authenticated then only we eill send him to sign up page
   return res.render('user_signup',{title:'codeial:Sign Up'})
   }else{
      return res.redirect('/users/profile')
   }
}

//rendering signin page
module.exports.signIn=function(req,res){
   if(req.isAuthenticated()){
      return res.redirect('/users/profile');
   }else{
   return res.render('user_signin',{title:'codeial:Sign In'})
   }
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
//manual authentication:- checkingif the user is present in the database
// module.exports.createSession=function(req,res){
//    //finding user 
//    User.findOne({email:req.body.email},function(err,user){
//       if(err){console.log('error in finding user in database in signing in');return;}
       
//       //handling user found in the database
//       if(user){
//          //password doesn't matches in the database
//          if(user.password!=req.body.password){
//             console.log('incorrect password');
//             return res.redirect('back');
//          }
    
//          //handle session creation by setting the cookie for the user
//          res.cookie('user_id',user._id);
//          return res.redirect('/users/profile');

//       }else{ //handing user not found in the database
//          return res.redirect('back');
//       }
//    });   
// };

//session is created in passport js 
module.exports.createSession=function(req,res){
   return res.redirect('/');
};

//to make user signOut
module.exports.destroySession=function(req,res){
   req.logout(); //function by passport 
   return res.redirect('/');
};

//creating the sign out request without passport
// module.exports.signOut = function(req, res){
//    res.clearCookie('user_id');
//    return res.redirect('/users/sign-in');
// };

//updating the user info from profile 
module.exports.update = function(req, res){
   if(req.user.id==req.params.id){
      User.findByIdAndUpdate(req.params.id,{name:req.body.name,email:req.body.email},function(err, user){
         return res.redirect('back');
      })
   }else{
      return res.status(401).send('Unauthorized');
   }

   
}