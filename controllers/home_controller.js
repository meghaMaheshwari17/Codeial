//exporting it and we need to acccess it in routes index.js
module.exports.home=function(req,res){
    //cookie coming in as request
    console.log(req.cookies);
    //changing the cookie in response         
    res.cookie('user_id',25);
    // return res.end('<h1>returning from home controller</h1>');
    return res.render('home',{title:"Home"}) //rendering home.ejs file
}

