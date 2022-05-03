//firing up express
const express=require('express');
//to read,write cookies
const cookieParser = require('cookie-parser');

const app=express(); //getting all the express functionality in app constant 
const port=8000;
//using db 
const db=require('./config/mongoose');

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

//need to tell that all the routes will be execute in routes/index.js
app.use('/',require('./routes')); 

//setting up template engine
app.set('view engine','ejs');
//searches for the views folder
app.set('views','./views');



//running the server 
app.listen(port,function(err){
    if(err){
        console.log(`Error in running the server: ${err}`)
       return;
    }
    console.log(`Server running successfully on ${port}`);
})