//firing up express
const express=require('express');
const app=express(); //getting all the express functionality in app constant 
const port=8000;



//running the server 
app.listen(port,function(err){
    if(err){
        console.log(`Error in running the server: ${err}`)
       return;
    }
    console.log(`Server running successfully on ${port}`);
})