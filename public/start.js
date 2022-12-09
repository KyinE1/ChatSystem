/** Backend; run within console using command: node 'filename.js' */
var express = require ('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var { Server } = require('socket.io');
var io = new Server(server);
var port = 8080;

/** Process the request made to the server. 
 * @param req: The request the client has made.
 * @param res: The data sent from the server to the client.
 * @note: To run locally from the console: node start.js
 * localhost:8080 or 127.0.0.1:8080 (Ctrl + c)
 * (Requirement 1.0)
 * */
app.get('/', function(req, res) {
	// Display index file content to the client:
	res.sendFile(__dirname + '/index.html');
	console.log('Client has sent a request to the server.');
});

// Use files found in public folder.
app.use(express.static('public'));

// Start Express server:
server.listen(port, () => {
	console.log('Listening to port ' + port + '...'); 
	console.log('Please go to "localhost:8080" or "127.0.0.1:8080" in your browser.');
});

/** Handle event triggers sent from index.js. 
 * @param socket: User attributes; handle events by emission.
 * (Requirement 2.0, 3.0, 5.0, 5.0.1, 5.1, 6.1, 6.1.1, 6.2)
 * */ 
io.on('connection', (socket) => {
	/** Notify of newly connected user. 
	 * @param username: Name of the client.
	 * */
	socket.on('connection', (username) => {
	 console.log('Connection:', socket.id + ' has connected.');
	 socket.broadcast.emit('login', username + ' has connected.');
	});

	/** Notify of disconnected user.
	 * @param username: Name of the client.
	 * */
	socket.on('disconnection', (username) => {
	 console.log('Disconnection:', socket.id + ' has disconnected.');
	 socket.broadcast.emit('logout', username + ' has disconnected.');
	});

  /** Set message to the content of the textarea. 
   * @param msg: Content to display. 
   * (Requirement 3.0)
   * */
   socket.on('message', (msg) => {
	console.log('Message:', socket.id + ' ' + msg);     
    socket.broadcast.emit('new_msg', msg);
   });

  /** Assign username from data input. 
   * @param new_username: New username data. 
   * @param old_username: Previous username data. 
   * */
  socket.on('username', (old_username, new_username) => {
  	console.log('Username:', + old_username + ' -> ' + new_username);
  	socket.broadcast.emit('new_username', old_username + ' became ' + new_username + '.');
  });

  /** Send message to specified contact.
   * @param contact: Recipient of data and message.
   * (Requirement 6.1, 6.2, 6.2.1)
   * */
   socket.on('contact', (contact) => {
   	console.log('Contact:', contact);

   	// Private message only the contact.
   	socket.to(contact.recipient).emit('private', {
   		msg: contact.data,
   		sender: socket.id,
   	});
   });

   /** Join the specified room.
    * @param username: Name of the client. 
    * @param chatroom: Name of the instance.
    * (Requirement 4.0, 4.0.1, 4.1.0) 
    * */
    socket.on('join_room', (username, chatroom) => {
     console.log('Join:', socket.id + ' ' + chatroom);

     // Allow only clients who have specified the room.
     socket.join(chatroom);
     io.to(socket.id).emit('join_room');
     io.to(chatroom).emit('message_room', username + ' has joined the room.');
    });
});

/* Historic functions, documentation, etc:
	var path = require('path');
	
	server.listen(app.get('port'), function() {
 		console.log('Port ' + app.get('port'));
    });

      Assign object property to innerHTML tag.
      @param msg: Data to assign for object.      
      socket.on('message', function(msg) {
        var new_item = document.createElement('li');
        var date = new Date();
        let hour = date.getUTCHours();
        let min = date.getUTCMinutes();

        new_item.textContent = '['hour + ': ' + min + '] ' + msg;
        window.scrollTo(0, document.body.scrollHeight);
        new_item.innerHTML = '<p>New Message Example</p>';
        document.body.appendChild(new_item);
      });

      Alternative message event.
      @param socket: Object containing the data.
      io.on('connection', (socket) => {
        
      Emit to display for all clients.
      @param msg: Content of the field used during submission. 
      socket.on('message', (msg) => {
          io.emit('Message: ' + msg);
          console.log('Message: ' + msg);
        });

      Assign the user input as display name. 
      @param data: Name to assign. 
      client.on('message', function(data) {
          if (!user) {
            user = data;
            console.log(user + 'is connecting to server...');
            socket.broadcast(user + 'is connecting to server...');
          }

          socket.broadcast(user + ': ' + data);
        });
      });
*/