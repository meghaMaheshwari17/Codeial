const Chat= require('../models/chat');

module.exports.creatingChat= async function(req, res){
    try{
        let chat=await Chat.create({
            message:req.body.message, 
            user:req.user
        });
        req.flash('success','message sent!');
        return res.redirect('back');
    }catch(err){console.log(err);return;}
}