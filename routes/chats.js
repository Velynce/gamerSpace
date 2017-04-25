var express = require('express');
var router = express.Router();
var Chat = require('../models/Chat.js');

// the route goes to the /chat.
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/add', function(req, res, next) {
		var newchat = new Chat({
			game: req.body.game,
			name: req.body.chatname,
			privateChat: req.body.private
		});
		res.redirect('/home');
		console.log('success');

		newchat.validate(function(err) {
			console.log('Error', err);
		});

		newchat.save(function(err) {
			if(err) return next(err);
		});
});

router.get('/chat/:id', function(req, res, next) {
	res.render('chat', {title: 'Chat Room'});
});

module.exports = router;
