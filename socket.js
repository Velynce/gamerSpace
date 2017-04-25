	var socket = io();
    var messages = document.querySelector('#messages');
    var form = document.querySelector('form');

    form.addEventListener("submit", addMessage, false);

     function addMessage(e) {
      e.preventDefault();
      socket.emit('chat message', document.querySelector('#m').value);
      document.querySelector('#m').value = '';
      //console.log("hello");
      // socket.emit('adduser', )
      
    }
    socket.on('connect', function(m) {
      var list = document.createElement('li');
      list.innerHTML += "You are successfully connected";
      messages.appendChild(list);
    });
    socket.on('disconnect', function(m) {
     var list = document.createElement('li');
     list.innerHTML += (m);
     messages.appendChild(list);
   });
    socket.on('chat message', function(m) {
      var list = document.createElement('li');
      list.innerHTML += (m);
      messages.appendChild(list);
    }); 