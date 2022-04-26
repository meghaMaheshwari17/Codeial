//will controller multiple users 
module.exports.profile = function(req,res){
   return  res.render('user_profile',{title:'user'})
}