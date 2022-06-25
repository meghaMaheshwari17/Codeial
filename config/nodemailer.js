//how we will interact with gmail will be defined here 
 //importing nodemailer 
const nodemailer = require('nodemailer');
//ejs is going to be used to render that template and send it 
const ejs = require('ejs');
const path= require('path');
const env=require('./environment');
//transporter 
let transporter=nodemailer.createTransport(
    //  service:'gmail',
    //  host:'smtp.gmail.com', //gmail smtp server address
    //  port:587, //TLS required
    //  secure:false, 
    //  auth:{
    //       user:'meghamaheshwari.imscit20', //the account from which you are sending emails
    //       pass:'xvshnkwizzmwzfsa'  //password
    //     } //have to establish your identity with google 
   env.smtp
);

//template to send email with some html

let renderTemplate=(data,relativePath)=>{ //relative path from where the mail is being sent 
    let mailHTML;  //what all html is going to be sent in the mail
    //ejs will give the html files
    ejs.renderFile(
        path.join(__dirname,'../views/mailers',relativePath), //path where data is 
        data, //content to be rendered
        function(err,template){ //callback function, template consist of path and data
             if(err){console.log('error in rendering template',err);return;}
             mailHTML = template; 
        }
    )
    return mailHTML;
}

module.exports ={
    transporter:transporter,
    renderTemplate:renderTemplate
}
