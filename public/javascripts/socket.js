    var chat = io().connect('http://localhost:3000/chat');
    var messages = document.querySelector('#messages');
    var form = document.querySelector('#chat');

    form.addEventListener("submit", addMessage, false);

     function addMessage(e) {
      e.preventDefault();
      chat.emit('chat message', document.querySelector('#m').value);
      document.querySelector('#m').value = '';
    }

    function switchRoom(room) {
      socket.emit('switchRoom', room);
    }

    chat.on('connect', function(m) {
      var list = document.createElement('li');
      list.innerHTML += "You are successfully connected";
      messages.appendChild(list);
      chat.emit('adduser', prompt("Enter a username:"));
    });
    chat.on('disconnect', function(m) {
     var list = document.createElement('li');
     list.innerHTML += (m);
     messages.appendChild(list);
   });
    chat.on('chat message', function(username,m) {
      var list = document.createElement('li');
      list.innerHTML += '<b>' + username + ':</b> ' + (m);
      messages.appendChild(list);
    });

    chat.on('updateusers', function(data) {
      $('#users').empty();
      $.each(data, function(key,value) {
        $('#users').append('<div>' + key + '</div>');
      });
    });

    chat.on('updaterooms', function(rooms, currentRoom) {
        $('#rooms').empty();
    $.each(rooms, function(key, value) {
      if(key == currentRoom){
        $('#rooms').append('<div>' + key + '</div>');
      }
      else {
        $('#rooms').append('<div><a href="http://localhost:3000/chat/:id" onclick="switchRoom(\''+key+'\')">' + key + '</a></div>');
      }
    });
  });