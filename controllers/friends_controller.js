const Friendship=require('../models/friendship');
const User=require('../models/user');
//adding friends to the friendship schema 
module.exports.addFriends= async function(req,res){
    try{
        let existing=await Friendship.findOne({
            from_user:req.query.uid,
            to_user:req.query.fid
        });
        if(existing){
            req.flash('success','Already a friend');
        }else{
        let friend=await Friendship.create({
            from_user:req.query.uid,
            to_user:req.query.fid
        });
        let user=await User.findById(req.query.uid);
        user.friendships.push(friend);
        console.log(user);
        req.flash('success','Added as friend!');
        }
        return res.redirect('back');
    }catch(err){console.log(err);return;}
    
}

module.exports.deleteFriend=async function(req,res){
    try{
        let friend=await Friendship.findOne({
            from_user:req.query.uid,
            to_user:req.query.fid
        });
        // console.log(friend);
        if(friend){
            await User.findByIdAndUpdate(req.params.uid,{ $pull:{friendships:friend._id}});
            friend.remove(); //deleting that particular friendship 
            req.flash('success','Deleted as friend');
        }else{
            req.flash('success','Not a friend')
        }
        return res.redirect('back');
    }catch(err){console.log(err);return;}
}