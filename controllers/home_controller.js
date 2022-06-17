const Post=require('../models/post');
//importing post schema to show posts
const User = require('../models/user');
const Comment = require('../models/comment');
const Friendship = require('../models/friendship');
//exporting it and we need to acccess it in routes index.js
//async declares that this function contains async code 
module.exports.home=async function(req,res){
    //cookie coming in as request
   // console.log(req.cookies);
    //changing the cookie in response         
    //res.cookie('user_id',25);
    // return res.end('<h1>returning from home controller</h1>');
    
    //old post db request which didn't have user name
    // Post.find({},function(err, posts){
    //     if(err){console.log('Error in displaying posts'); return;}
    //     return res.render('home',{title:"Codeial | Home",posts:posts}) //rendering home.ejs file
    // });  

    // Post.find({})
    // .populate('user')
    // .populate({   //populating comment and user of that comment  
    //    path:'comments',
    //    populate:{
    //        path:'user'
    //    }
    //  })                 
    // .exec(function(err, posts){
    //     if(err){console.log('Error in displaying posts'); return;}
    //     User.find({},function(err, user){ //to display all the users in the home page
    //         return res.render('home',{
    //             title:"Codeial | Home",
    //             posts:posts,
    //             all_users:user
    //         }) //rendering home.ejs file
    //     })
        
        
    // });//prepopulating posts so user will contain the whole user data from db 
    //now will have to preopulate the post so that comments can also load 
   

    //using then  
   // Post.find({}).populate('comments').then(function(){});

   //let posts=Post.find({}).populate('comments').exec();
   //posts.then(); //promise 

   //async await:- when code gets more callbacks 
   //it tells your server that this code contains async statements  and you need to wait at each statement and once it gets executed then move on to next statement

   try{//for errors, need to be put only once 
   
   let posts=await Post.find({})
   .sort('-createdAt') //to sort it according to the time
   .populate('user')
   .populate({   //populating comment and user of that comment  
      path:'comments',
      populate:{
          path:'user'
      },
    //   getting the likes of each comment too
      populate:{
        path:'likes'
      }
    }).populate('likes'); //populating likes of each post
    //once post part gets executed then only user part gets executed 
    let user=await User.find({});
    let friends;
    if(req.user){
       friends=await Friendship.find({from_user:req.user._id}).populate('to_user','name') //populating friends of each post
      
    }
   
    //once post and user is executed then we return something to the browser  
    return res.render('home',{
        title:"Codeial | Home",
        posts:posts,
        all_users:user,
        all_friends:friends
    }) //rendering home.ejs file
  }catch(error){
      console.log(error);
      return;
  }
}

