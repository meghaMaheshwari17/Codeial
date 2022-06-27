const env=require('./environment');
const fs=require('fs');
const path=require('path');
// calling it in index.js
// global function which will be there in app 
module.exports=(app)=>{
    app.locals.assetPath=function(filepath){
        // first it will check if environment is development or production
        if(env.name=='development'){
            console.log('dev');
            return '/' + filepath; //if development then return './assets'
        }
        
        return '/'+JSON.parse(fs.readFileSync(path.join(__dirname,'../public/assets/rev-manifest.json')))[filepath];//accessing the value in rev.manifest.json
    }
}