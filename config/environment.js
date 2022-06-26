// setting up morgan here 
 const fs=require('fs');
//const rfs=require('rotating-file-stream');
 const path=require('path');
 const FileStreamRotator = require('file-stream-rotator');
// defines where the log will be stored
 const logDirectory=path.join(__dirname,'../production_logs');
// if production_logs already exists or it needs to be created 
 fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// for accessing the log directory
// const accessLogStream=rfs('access.log',{
//    interval:'1d', //for how much time the logs shpuld be stored:-1 day
//    path:logDirectory //where it should be stored 
// });

// create a rotating write stream
var accessLogStream = FileStreamRotator.getStream({
  date_format: 'YYYYMMDD',
  filename: path.join(logDirectory, 'access-%DATE%.log'),
  frequency: 'daily',
  // verbose: false
})

// this file contains development and production 
// we need to put passwords,secret key generators all in one file 
const development={
    name:'development',
    asset_path:'./assets',    //putting the path to our static files
    session_cookie_key:'blahsomething',  //from index.js
    db:'codeial_production', //name of database 
    smtp: { service:'gmail',
     host:'smtp.gmail.com', //gmail smtp server address
     port:587, //TLS required
     secure:false, 
     auth:{
          user:'meghamaheshwari.imscit20', //the account from which you are sending emails
          pass:'xvshnkwizzmwzfsa'  //password
        }
     } ,//have to establish your identity with google 
    google_clientID:"624659588045-jqns155uds8jqnuf42kj5psjj28hc0bo.apps.googleusercontent.com", //taken from console.developers.google.com credentials
    google_clientSecret:"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",
    google_callbackURL:"http://codeial.com/users/auth/google/callback",
    jwt_secret:'codeial',
    morgan:{
      mode:'dev',
      options:{stream:accessLogStream}
    }
    
}

// the difference between production and development is that all these keys would be hidden somewher in another file so that new developers do not get access to these keys
// for setting the enviornment for the file:- in the powershell:- $env:ASSET_PATH="/asset" , have to got to node shell (by typing node in the power shell) then see process.env.ASSET_PATH
const production={
    name:'production',
    asset_path:process.env.ASSET_PATH,    //putting the path to our static files
    session_cookie_key:process.env.CODEIAL_SESSION_COOKIE_KEY, //from index.js
    db:process.env.CODEIAL_DB, //name of database 
    smtp: { service:'gmail',
     host:'smtp.gmail.com', //gmail smtp server address
     port:587, //TLS required
     secure:false, 
     auth:{
          user:process.env.CODEIAL_GMAIL_USERNAME, //the account from which you are sending emails
          pass:process.env.CODEIAL_GMAIL_PASSWORD  //password
        }
     } ,//have to establish your identity Swith google 
    google_clientID:process.env.CODEIAL_GOOGLE_CLIENTID, //taken from console.developers.google.com credentials
    google_clientSecret:process.env.CODEIAL_GOOGLE_CLIENTSECRET,
    google_callbackURL:process.env.CODEIAL_GOOGLE_CALLBACKURL,
    jwt_secret:process.env.CODEIAL_JWT_SECRET,
    morgan:{
      mode:'combined',
      options:{stream:accessLogStream}
    }
}

// module.exports=development;
module.exports=eval(process.env.ENVIRONMENT)==undefined ? development : (process.env.ENVIRONMENT); //will export 'production'
// importing it in index.js


