//whenever you comment a mail is going to be sent to you, so all the comments related mails are gonna be here 
const nodeMailer=require('../config/nodemailer');

//create a function which will send that mail 

//another way of exporting a method :- call this function in comments controller
exports.newComment=(comment)=>{
    console.log('working');

    //send an email :- send mail is a predefined function
    nodeMailer.transporter.sendMail({
       from:'meghamaheshwari.imscit20',
       to:comment.user.email, //sending it to the person who commented 
       subject:"New Comment:Published",
       html:'<h1>Yup, your comment has been published</h1>'
    },(err,info)=>{
        if(err){console.log('error in sending email',err);return;}
        console.log('message sent',info); 
        return;
    }); //callack function, info carries the info about the request that has been sent
}