//connecting our database
const mongoose=require('mongoose');
// replacing the db name 
const env=require('./environment');
mongoose.connect(`mongodb://localhost/${env.db}`);

const db=mongoose.connection;

db.on('error',console.error.bind(console,'error connecting to db'));

db.once('open',function(){
    console.log('Connected to database :: MongoDB');
});

module.exports=db;