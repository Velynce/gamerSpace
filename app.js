var express = require('express');
session = require('express-session');
// var nodemailer = require('nodemailer');
var path = require('path');
var favicon = require('serve-favicon');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var BnetStrategy = require('passport-bnet').Strategy;
var bNetID = "gz4tqh64x7ywv5369442ejjuh92bjhee";
var bNetSecret = "HuU3xw5saWShanQbBEY7yzqFqt9b45WK";
var Chat = require('./models/Chat.js');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();

var firebase = require('firebase');
var mongoose = require("mongoose");

mongoose.connect('mongodb://localhost/gamerdb', function(err) {
  if(err) {
    console.log('error connecting', err);
  } else {
    console.log('connected');
  }
});

var http = app.listen(3000, function() {
  console.log('listening on port 3000');
});
var io = require('socket.io')(http);
var namesp = io.of('/home');
var chatnum = 1;
namesp
.on('connection', function(socket) {
  console.log('Connection Established');

  });


var routes = require('./routes/index');
var users = require('./routes/users');
var chats = require('./routes/chats');

app.get("/chat/:id", function(req, res) {
  Chat.findOne({chatname: req.params.id})
  .exec(function(err, chat) {
    console.log(chat);
     res.render('chat', {title: 'Chat Room', user:req.user, chatinfo:chat});
  });
});

app.use(function(req,res,next) {
  res.io = io;
  next();
});

var usernames = {};
var rooms = {}


io.on('connection', function(socket) {
  Chat.find(function(err, chats) {
    if(err) return next(err);
    var ChatRoom = chats.name;
  });

  socket.on('chat message', function(msg) {
    io.sockets.in(socket.room).emit('chat message', socket.username, msg);
  });

  socket.on('adduser', function(username) {
    socket.username = username;
    usernames[username] = username;

    socket.room = 'room1';
    socket.join(socket.room);
  
    socket.emit('chat message', 'server', 'you have connected to ' + socket.room);
    socket.broadcast.to(socket.room).emit('chat message', 'Server', username + " has connected");
    io.sockets.emit('updateusers', usernames);
    socket.emit('updaterooms', rooms, socket.room);
  });

  socket.on

  socket.on('switchRoom', function(newroom) {
    socket.leave(socket.room);
    socket.join(newroom);
    socket.emit('chat message', 'Server', 'you have connected to ' + newroom);
    socket.broadcast.to(socket.room).emit('chat message', 'Server', socket.username + ' has left this room');

    socket.room = newroom;
    socket.broadcast.to(newroom).emit('chat message', 'Server', socket.username + ' has joined this room');
    socket.emit('updaterooms', rooms, newroom);
  });

  socket.on('disconnect', function() {
    delete usernames[socket.username];

    io.sockets.emit('updateusers', usernames);
    socket.broadcast.emit('chat message', 'Server', socket.username + ' has disconnected'); 
    socket.leave(socket.room);
  });
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret:"restingaway", resave:false, saveUnitialized:true, key: 'sid'}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
  clientID: "114833920332-jnkopvbej4hts9dvikivsk56fnui6t6d.apps.googleusercontent.com",
  clientSecret: "IXSVAEs9qR7NXaFQ-YVRlgob",
  callbackURL: "http://localhost:3000/auth/google/callback",
  scope: ['profile', 'email', 'openid']
},
 function(accessToken, refreshToken, profile, done) {
  process.nextTick(function() {
    console.log(profile);
    return done(null, profile);
  });
 }
));

passport.use(new BnetStrategy({
  clientID: bNetID,
  clientSecret: bNetSecret,
  callbackURL: 'http://localhost:3000/auth/bnet/callback',
  region:'us',
  scope: ['current_user']
}, function(accessToken, refreshToken, profile, done) {
  return done(err, profile);
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// var transporter = nodemailer.createTransport({
//   service: 'Gmail',
//   auth: {
//     user: 'skydenfinn@gmail.com',
//     pass: 'Nevergiveup101'
//   }
// });

// var mailOptions = {
//   from: req.body.email,
//   to: "skydenfinn@gmail.com",
//   subject: "ContactUs",
//   text: req.body.message
// }

// if(req.body.submit) {
//   transporter.sendMail(mailOptions, function(error, info) {
//     if(error) {
//     console.log(error);
//   } 
//   else {
//     res.send('Message has been Sent!');
//   }
//   });
// }


var firebase = require('firebase');
require('firebase/auth');
require('firebase/database');

var config = {
    apiKey: "AIzaSyC4uhT0VVVnZfMxawZ0X2yySxhXv9Bcq0w",
    authDomain: "gamerspace-178bb.firebaseapp.com",
    databaseURL: "https://gamerspace-178bb.firebaseio.com",
    projectId: "gamerspace-178bb",
    storageBucket: "gamerspace-178bb.appspot.com",
    messagingSenderId: "114833920332"
  };
var fb = firebase.initializeApp(config);

app.use('/', routes);
app.use('/users', users);
app.use('/chats', chats);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = {app: app, fb: fb};
