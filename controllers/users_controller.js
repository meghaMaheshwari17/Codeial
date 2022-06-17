//importing user schema from models/user
const User = require('../models/user');
const Password = require('../models/password');
const Friendship = require('../models/friendship');
const fs = require('fs'); //for deleting the avatar
const path = require('path'); //for deleting the avatar path
//for generating access token
const crypto=require('crypto');
// for sending email
const passwordMailer= require('../mailers/password_mailer');
// let's keep it same as before
module.exports.profile = async function(req, res){
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
    
    try{
        let profile_user=await User.findById(req.params.id);
        let checkUserFriend=await Friendship.findOne({
            from_user:req.user.id, 
            to_user:req.params.id
        });
        let exists=false;
        if(checkUserFriend){
           exists=true;
        }
        return res.render('user_profile', {
            title: 'User Profile',
            profile_user: profile_user,
            exists:exists
        });
    }catch(err){console.log(err);return;}

}


module.exports.update = async function(req, res){
    if(req.user.id == req.params.id){

        try{

            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function(err){
                if (err) {console.log('*****Multer Error: ', err)}
                
                user.name = req.body.name;
                user.email = req.body.email;

                if (req.file){

                    if (user.avatar){
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                    }


                    // this is saving the path of the uploaded file into the avatar field in the user
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                return res.redirect('back');
            });

        }catch(err){
            req.flash('error', err);
            return res.redirect('back');
        }


    }else{
        req.flash('error', 'Unauthorized!');
        return res.status(401).send('Unauthorized');
    }
}


// render the sign up page
module.exports.signUp = function(req, res){
    if (req.isAuthenticated()){
        return res.redirect('/users/profile');
    }

    //if user is not authenticated then only we eill send him to sign up page
    return res.render('user_signup', {
        title: "Codeial | Sign Up"
    })
}


// render the sign in page
module.exports.signIn = function(req, res){

    if (req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_signin', {
        title: "Codeial | Sign In"
    })
}

// get the sign up data from signup page
module.exports.create = function(req, res){
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
// sign in and create a session for the user
module.exports.createSession = function(req, res){
    //the function that is creating the session need to tell if the request is correct or not for flash message 
    req.flash('success', 'Logged in Successfully');
    return res.redirect('/');
}

//to make user signOut
module.exports.destroySession = function(req, res){
    req.logout();
     //flash messaage:- its on req, we have to transfer it to res  
    req.flash('success', 'You have logged out!');
    return res.redirect('/');
}

//creating the sign out request without passport
// module.exports.signOut = function(req, res){
//    res.clearCookie('user_id');
//    return res.redirect('/users/sign-in');
// };

// when user forgets password we render the forgot password page
module.exports.forgotPassword = function(req, res){
    return res.render('forgot_password',{
        title: 'Forgot Password'
    })
}

// sending email to user when they forget password
module.exports.checkEmail= async function(req, res){
    try{
        // finding user with that info and sending the mail to him
        let user=await User.findOne({email:req.body.email});
        if(user){
            // for creating acessToken
         let accessToken = crypto.randomBytes(20).toString('hex');
         // sending the email 
        passwordMailer.newPassword(user,accessToken);
        // creating password in the database
        Password.create({
            user:user,
            accessToken:accessToken,
            isValid:true
         },function(err, password){
            if(err){console.log(err);return;}
            req.flash('success','Email sent!');
            return res.redirect('/users/sign-in');
         })
       }else{
       req.flash('error','Enter registered email');
      return res.redirect('back');
       }
    }catch(err){
        console.log(err);
        return;
    }
   
}

// when user gets redirected to rest password page 
module.exports.resetPassword = async function(req, res){
 try{
    // finding if the link is valid or not
    let password=await Password.findOne({accessToken:req.params.accessToken});
    if(password.isValid=='false'){
        return res.status(401).send('This link is expired now')
    }else{
        return res.render('reset_password',{title:'Reset Password',accessToken:req.params.accessToken});
    }
 }catch(err){console.log(err);return;}
    
   
}

// getting the password from the email and checking it
module.exports.checkResetPassword= async function(req, res){
    try{
        if(req.body.password!=req.body.confirm_password){ //checking if password and confirm_password are same or not
            req.flash('error','Enter correct password');
            return res.redirect('back');
        }
        // finding password in the database with acessToken , if its isValid is true then we make it false, so that we know we already visited this, then find the user and set its password
        let password=await Password.findOne({accessToken:req.params.accessToken});
        if(password){
            if(password.isValid){
                password.isValid = 'false';
                password.save();
                await User.findOneAndUpdate(password.user, {$set:{password:req.body.password}}, {new: true}, (err, user) => {
                    if (err) {
                        console.log("Something wrong when updating data!");
                    }
                    req.flash('success','Password has been changed successfully!');
                    return res.redirect('/users/sign-in');
                });
                
            }
        }
   
        return res.redirect('/');
    }catch(err){console.log(err);return;}
    


}