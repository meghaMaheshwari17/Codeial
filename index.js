//firing up express
const express=require('express');
//to read,write cookies
const cookieParser = require('cookie-parser');

const app=express(); //getting all the express functionality in app constant 
const port=8000;
//using db 
const db=require('./config/mongoose');

//imprting express session for encryption of cookies 
const session=require('express-session');
//imprting possport and passport-local for session cookie
const passport=require('passport');
const passportLocal=require('./config/passport-local-strategy');

//setting up mongoStore to store session cookie in mongoDB so when the server refreshes we are not logged out
const MongoStore=require('connect-mongo')(session); //session is give as argument as it requires to save it
//to use sass 
const sassMiddleware=require('node-sass-middleware');
//using sass before server starts
app.use(sassMiddleware({
    src:'./assets/scss', //from where the sass files will be picked up
    dest:'./assets/css', //where do scss files should be put 
    debug: true, //errors would be shown in terminal
    outputStyle:'extended', //put it in multiple(extended) or single lines(compress)
    prefix:'/css'  //where should the server look for scss files
}));

//to read post requests from forms and all 
app.use(express.urlencoded());

//to use cookieParser
app.use(cookieParser());


//accessing static files
app.use(express.static('./assets'));

// requiring layouts
const expressLayouts=require('express-ejs-layouts');

//put layout before views
app.use(expressLayouts);
//to make link tags for css get into header section for different files
 //extract style and scripts from sub pages in to the layout
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);


//setting up template engine
app.set('view engine','ejs');
//searches for the views folder
app.set('views','./views');

//adding a middleware which takes in that session cookie and encrypts it and stores it in db
app.use(session({
    name:'codeial', //name of my cookie 
    //to do change the secret before deployment in production mode
    secret:'blahsomething', //to encode it 
    saveUninitialized:false, //when the user identity is not established, I don't want to store extra data in my session cookie
    resave:false,//when the identity is established or data is present in session cookie, I don't want to resave it again and again
    cookie:{
        maxAge:(1000*60*100), //will define after how long that session cookie expires in minutes
    },
    store:new MongoStore({ //will store session cookie in mongodb
            mongooseConnection:db,
            autoRemove:'disabled'
    },function(err){
        console.log(err || 'connect-mongodb setup done');
    })
}));




//need app to use passport 
app.use(passport.initialize());
//passport helps in maintaining sessions 
app.use(passport.session());

//setting cuurent user :_ whenever any request comes this middleware will be called and user will be set in views
app.use(passport.setAuthenticatedUser);


//need to tell that all the routes will be execute in routes/index.js
app.use('/',require('./routes'));  

//running the server 
app.listen(port,function(err){
    if(err){
        console.log(`Error in running the server: ${err}`)
       return;
    }
    console.log(`Server running successfully on ${port}`);
})