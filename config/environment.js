// this file contains development and production 
// we need to put passwords,secret key generators all in one file 
const development={
    name:'development',
    asset_path:'./assets',    //putting the path to our static files
    session_cookie_key: 'blahsomething', //from index.js
    db:'codeial_development', //name of database 
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
    google_callbackURL:"http://localhost:8000/users/auth/google/callback",
    jwt_secret:'codeial',
    
}

const production={
    name:'production'
}

module.exports=development;
// importing it in index.js
