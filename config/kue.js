//configuring kue here
const kue=require('kue');

const queue=kue.createQueue(); 

module.exports =queue;