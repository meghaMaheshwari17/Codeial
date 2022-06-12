// whenever someone forgets a password a mail is going to be sent to them 
const nodeMailer=require('../config/nodemailer');


//will call this function in users controller 
exports.newPassword =(user,accessToken)=>{
    console.log('working');
    
    // defining the template we are sending it with
    let htmlString=nodeMailer.renderTemplate({user:user,accessToken:accessToken},'/password/new_password.ejs');
    //  sending the email 
    nodeMailer.transporter.sendMail({
        from:'meghamaheshwari.imscit20',
        to:user.email,
        subject:"Password change",
        html:htmlString
    },(err,info)=>{
        if(err){console.log('error in sending email',err);return;}
        console.log('message sent',info); 
        return;
    });
}