//firing up express
const express=require('express');
// for storing environment variables dotenv is used
require('dotenv').config({path:"./vars/.env"});
// importing environment file 
const env=require('./config/environment');
console.log(env.name,env.asset_path);


// calling morgan to save logs at the time of production 
const logger = require('morgan');
//to read,write cookies
const cookieParser = require('cookie-parser');

const app=express(); //getting all the express functionality in app constant 

// importing view_helper.js file:- now this view helper will be available in views 
// so that at the time of production we access minified js css files
require('./config/view_helpers')(app);

const port=8000;
//using db 
const db=require('./config/mongoose');

//imprting express session for encryption of cookies 
const session=require('express-session');
//imprting possport and passport-local for session cookie
const passport=require('passport');
const passportLocal=require('./config/passport-local-strategy');
//for using jwt with passport
const passportJWT=require('./config/passport-jwt-strategy'); 
//for using google authentication
const passportGoogle=require('./config/passport-google-oauth2-strategy')
//setting up mongoStore to store session cookie in mongoDB so when the server refreshes we are not logged out
const MongoStore=require('connect-mongo')(session); //session is give as argument as it requires to save it
//to use sass 
const sassMiddleware=require('node-sass-middleware');
// importing flash for flash-messages 
const flash=require('connect-flash');
//importing custom middleware to be used (for flash)
const customMiddleware=require('./config/middleware');

// importing sockets for chat engine and setting it up
const chatServer=require('http').Server(app);
const chatSockets=require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000); 
console.log('chat server is listening on port 5000')

const path=require('path');
//using sass before server starts
if(env.name=='development'){ //load the sass only in development mode
    console.log('in development mode..');
    app.use(sassMiddleware({
        src: path.join(__dirname,env.asset_path,'/scss'),      //'./assets/scss', //from where the sass files will be picked up
        dest: path.join(__dirname,env.asset_path,'/css'),//'./assets/css', //where do scss files should be put 
        debug: true, //errors would be shown in terminal
        outputStyle:'extended', //put it in multiple(extended) or single lines(compress)
        prefix:'/css'  //where should the server look for scss files
    }));
}


//to read post requests from forms and all 
app.use(express.urlencoded());

//to use cookieParser
app.use(cookieParser());


//accessing static files
// app.use(express.static('./assets'));
app.use(express.static(env.asset_path));
//making the uploads path to avatar available to the browser
app.use('/uploads',express.static(__dirname + '/uploads'));

// the logger will be used here 
app.use(logger(env.morgan.mode,env.morgan.options));

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
    secret:env.session_cookie_key, //to encode it 
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

//using flash for flash messages
app.use(flash());
//to use the custom middleware for flash messages
app.use(customMiddleware.setFlash);

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