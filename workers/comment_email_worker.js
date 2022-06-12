//worker for comment queue 
const queue=require('../config/kue');

//we need the call to mailer function to go inside the queue 
const commentsMailer=require('../mailers/comments_mailer');
//every worker should have a process function that tells the worker that whenever a new task is added to the queue you need to run that task in the process function 

queue.process('emails',function(job,done){
    //job is two things:- one the function that needs to be inside of this:- that is the mailer which is going to be called and second is the data(comment) and sending that email with that data
    console.log('email worker is processing a job ',job.data); 

    commentsMailer.newComment(job.data); //calling the mailer function to send the mail
    
    done();
}) //first is name of the queue, second is the job

//this worker should be called from controller so that we are putting the function in the queue of this worker 

//redis server how to start:- wsl terminal :- sudo service redis-server start , redis-cli 
// 127.0.0.1:6379> ping