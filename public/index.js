      var socket = io('http://localhost:8080');
      var field_username = document.getElementById('field_username');
      var btn_username = document.getElementById('btn_username');
      var field_msg = document.getElementById('field_msg');
      var btn_msg = document.getElementById('btn_msg');
      var field_room = document.getElementById('field_room');
      var btn_room = document.getElementById('btn_room');
      var field_contact = document.getElementById('field_contact');
      var btn_contact = document.getElementById('btn_contact');
      var text_area = document.getElementById('text_area');
      var about_user = document.getElementById('btn_1');
      var about_room = document.getElementById('btn_2');
      var about_contact = document.getElementById('btn_3');

      /** Contains the attributes for individual client.
       * @param username: Display name.
       * @param password: Login constraint.
       * @param logged_in: Whether the user is logged into server.
       * @param socket_id: Unique generation of id for client. 
       * @note: Constructor to create new registration for user.
       * */
      class User {
        constructor(username, password, logged_in, socket_id) {
          this.username = username;
          this.password = password;
          this.logged_in = logged_in;
          this.socket_id = socket_id;
        }

        username = '';
        password = '';
        socket_id;
        logged_in = false;
      };
      
      var new_user = new User('Guest', 'Shaker', true, socket.id);
      append_data('Welcome to: "Software Builder: Chat"!', true);

      /** Upon mouseclick, emit data (trigger backend event) 
       * and append field data. 
       * @param event: 
       * */
      btn_msg.addEventListener('click', function(event) {
        event.preventDefault();

        // Send content contained in the field to everyone.
        if (field_msg.value != '') {
          const msg = field_msg.value;
          
          socket.emit('message', new_user.username + ': ' + msg);
          append_data(new_user.username + ': ' + msg, false);
          field_msg.value = '';
         }
      });

      /** Upon mouseclick, emit data (trigger backend event) 
       * and update the username field. 
       * @param event: 
       * */
      btn_username.addEventListener('click', function(event) {
        event.preventDefault();

        // Set content contained in the field.
        if (field_username.value != '') {
          const username = field_username.value;

          socket.emit('username', new_user.username, username);
          append_data(new_user.username + ' became ' + username + '.', true);
          new_user.username = username;
          field_username.value = '';
        }
      });

      /** Upon mouseclick, send data to a specific client on the server. 
       * @param event: 
       * */
      btn_contact.addEventListener('click', function(event) {
        event.preventDefault();

        // Send message to the recipient. 
        if (field_contact.value != '') {
          var contact = field_contact.value;
          var msg = field_msg.value;

          if (msg == '') {
            msg = prompt('Please enter a message to send to the user:');
          }

          // Sending an object 'contact' to the backend containing 
          // the recipient and message data members.
          socket.emit('contact',  {
            recipient: contact,
            data: msg, 
          });

          alert('The message has been sent.');
          field_contact.value = '';
          field_msg.value = '';
        }
      });

      /** Connect client to specified room. 
       * @param event:
       * */
      btn_room.addEventListener('click', function(event) {
        event.preventDefault();

        socket.emit('join_room', new_user.username, field_room.value);
        field_room.value = '';
      });

      /** Notify of connected user. */
      socket.on('connect', () => {
        append_data(new_user.username + ' has connected to the server.', false);
        socket.emit('connection', new_user.username);
      });

      /** Catch event emission over the backend. 
       * @param data: Notification of new login. 
       * */
      socket.on('login', (data) => {
        console.log('Login:', data);
        append_data('A new ' + data, true);
      });

      /** Notify of disconnected user. */
      socket.on('disconnect', () => {
        append_data(new_user.username + ' has disconnected from the server.', true);
        socket.emit('disconnection', new_user.username);
        new_user.logged_in = false;
      });

      /** Catch event emission over the backend. 
       * @param data: Notification of disconnection. 
       * */
      socket.on('logout', (data) => {
        console.log('Logout:', data);
        append_data(data, true);
        new_user.logged_in = false;
      });

      /** Complete Contact User request. 
       * @param contact: Message and socket.id of user.
       * */
      socket.on('private', (contact) => {
        // contact.data;
        // contact.sender;
        console.log('Private:', contact);
        append_data('(Private) ' + new_user.username + ': ' + contact.msg, true);
      });

      /** Complete Set Username request. 
       * @param data: Previous username to new. 
       * */
      socket.on('new_username', (data) => {
        console.log('New_Username:', data);
        append_data(data, true);
      });

      /** Complete Send Message request. 
       * @param data: New message.
       * */
      socket.on('new_msg', (data) => {
       console.log('New_Msg:', data);
       append_data(data, true);
      });

      /** Complete Join Room request. */
      socket.on('join_room', () => {
       console.log('Join_Room:', 'Success');
      });

      /** Send message only to clients connected to the room. 
       * @param msg: Data to send. 
       * */
       socket.on('message_room', (msg) => {
        console.log('Message_Room:', msg);
        append_data(msg, true);
       });

      /** Append data to textarea. 
       * @param data: Message to append in the textarea.
       * @param flag: Boolean value to determine what type of data is displayed. 
       * */
      function append_data(data, flag) {
        var date = new Date();
        let h = date.getUTCHours();
        let m = date.getUTCMinutes();
        let str = '[' + h + ':' + m + '] ';

        text_area.value += str + data + '\n';
        window.scrollTo(0, document.body.scrollHeight);
      }

      about_room.addEventListener('click', function(event) {
        alert('Using the "Join Room" button, a specific port can be accessed that will only display messages to clients who have joined the room.');
      });
 
      about_user.addEventListener('click', function(event) {
        alert('Using the "Set Username" button, a new display name can be set.');
      });
 
      about_contact.addEventListener('click', function(event) {
        alert('Using the "Contact User" button, a specific client can be sent a message.\n\nIn order to use this event, type the content of the event in the "Send Message" field, then type the socket.id of the user in the "Contact User field" or enter the socket.id and enter the message content into the prompt.\n\nTo contact a user, you need the socket.id of another client. In the developer tools, write "socket.id" and copy the string of text. This string is how other clients would use in the "Contact User" field to send a private message.');
      });