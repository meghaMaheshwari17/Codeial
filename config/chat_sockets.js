// for chat engine 
// getting passed socketsserver from index.js
// frontend part is in js
// importing the js part and this part to home.ejs
// chat_engine.js will be the file communicating from client side that is you and the broswer and chat_sockets.js is going to be the observer or server which will receive the incoming connections  
// chatengine class is for sending the request for connection and chat sockets is for receving the request for connection 
module.exports.chatSockets=function(socketServer){
// this io will handle the connection
    let io=require('socket.io')(socketServer);

    // once this connetion establishes then this sends back an acknowledgement by emitting a 'connect' event to chat_engine.js
  io.sockets.on('connection',function(socket){
    console.log('new connection received',socket.id);
    // whenever client disconnects 
    socket.on('disconnect',function(){
      console.log('socket disconnected');
    });
  //  emits sends and .on detects the event 
    socket.on('join_room',function(data){
      console.log('joining request rec. ',data);
      // if a chat room with this data.chatroom name exists so the user will be entered into that chat room, if it doesn't exist then it will create that chat room 
      socket.join(data.chatroom);
      // when someone joins we have to notify everyone that someone joined
      // when you want to emit in a specific chat room you do io.in  
      io.in(data.chatroom).emit('user_joined',data); //request will be acknowledged in chat_engine.js
    });

    // detecting an event called send_message and broadcasting it to everyone in the chat room 
    socket.on('send_message', function(data){
      io.in(data.chatroom).emit('receive_message',data); //detecting this event in front end side that is chat_engine.js
    })
    
  });

}