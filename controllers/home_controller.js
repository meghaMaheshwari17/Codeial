//exporting it and we need to acccess it in routes index.js
module.exports.home=function(req,res){
    // return res.end('<h1>returning from home controller</h1>');
    return res.render('home',{title:"Home"}) //rendering home.ejs file
}

