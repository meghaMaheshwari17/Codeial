// intialising this class in home.ejs
class ChatEngine{
    constructor(chatBoxId,userEmail,userName,userId){ //id of the chat box and the id of the user intiating the connection
         this.chatBox=$(`${chatBoxId}`);
         this.userEmail=userEmail;
         this.userName=userName;
         this.userId=userId;
        //  we need to intiate the connection :- will fire 'connection' event in chat_sockets.js
        this.socket=io.connect('http://localhost:5000') //io is gloabal variable available with cdn script tag
        
        // if user asks for connection then only call for connection 
        if(this.userEmail){
            this.connectionHandler();
        }
    }
    // creating a connection handler 
    connectionHandler(){
        let self=this;

        // event that takes place first is connection 
        this.socket.on('connect',function(){
            console.log('connection established using sockets...');
            // to ask for joining the chat room , while sending a request you can also send data along side
            // when this event will be emitted it will be received in chat_sockets.js s
            self.socket.emit('join_room',{
                 user_email:self.userEmail, //sending your own username
                 user_name:self.userName,
                 user_id:self.userId,
                 chatroom:'codeial' //which chat room you want to join 
            })
            // when a new user joins 
            self.socket.on('user_joined',function(data){
                 console.log('user joined:',data);
            });
            
            // whenever someone clicks the send message button then emit an event send_message,then detect it on servers
            $('#create-chat-form').submit(function(event){
                event.preventDefault();
                let msg=$('#chat-message-input').val();
                console.log(msg);
                if(msg!=''){    
                        self.socket.emit('send_message',{
                            message:msg,
                            user_email:self.userEmail,
                            user_name:self.userName,
                            user_id:self.userId,
                            chatroom:'codeial'
                        });
                }
                $('#chat-message-input').val("");
            })
            // $('#send-message').click(function(){
               
            // })

            // when someone receives a message :- emitted from server side  
            self.socket.on('receive_message',function(data){
                console.log('message received',data.message);
                let newMessage=$('<li>'); //making a new li tag
                let messageType='other-message'; //class determines alignment of the message
                // if email is different then message sent by other user 
                if(data.user_email==self.userEmail){
                    messageType='self-message';
                }
                newMessage.append($('<span>',{
                    'html':data.message
                }));
                newMessage.append($('<sub>',{ //who sent the message will be displayed
                    'html':data.user_name
                }));
                newMessage.addClass(messageType);
                // appending it in ul tag
                $('#chat-messages-list').append(newMessage);
               
            })

        });



    }
}