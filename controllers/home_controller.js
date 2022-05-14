const Post=require('../models/post');
//importing post schema to show posts


//exporting it and we need to acccess it in routes index.js
module.exports.home=function(req,res){
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

    Post.find({})
    .populate('user')
    .populate({   //populating comment and user of that comment  
       path:'comments',
       populate:{
           path:'user'
       }
     })                 
    .exec(function(err, posts){
        if(err){console.log('Error in displaying posts'); return;}
        return res.render('home',{title:"Codeial | Home",posts:posts}) //rendering home.ejs file
    });//prepopulating posts so user will contain the whole user data from db 
    //now will have to preopulate the post so that comments can also load 
   
}

