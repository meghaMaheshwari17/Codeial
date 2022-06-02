const User=require('../../../models/user');
const jwt=require('jsonwebtoken');

//whenever a user name and password is received, we need to find that user and generate a web token for it
//this is for sign in
module.exports.createSession = async function(req, res){
    try{

        let user=await User.findOne({email:req.body.email});
        if(!user || user.password!=req.body.password){ //if user is not found or the password entered and the one in db doesn't match
             return res.json(422,{
                message:"invalid username/password"
             });
        }
        //if user is found 
        return res.json(200,{
            message:'signed in successfully..here is your token',
            data:{ //sign is a jwt function
                token:jwt.sign(user.toJSON(),'codeial',{expiresIn:'100000'}) //converting user info to json, then the key to encrypt and then the time it expires in
            }
        })
    }catch(error){
        return res.json(500,{
            message:'error'
        })
    }

    

}