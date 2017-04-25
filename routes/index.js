var firebase = require('firebase');
var express = require('express');
var passport = require('passport');
var Chat = require('../models/Chat.js');
var User = require('../models/User.js');
var router = express.Router();

function isAuthenticated(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	} else {
		return res.redirect('/');
	}
}

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('login', { title: 'Log In' });
});



//authenticated routes.
router.get('/home', isAuthenticated, function(req, res, next) {
	Chat.find(function(err, chats) {
		if(err) return next(err);
	res.render('index', {chats:chats, title: 'Home', user:req.user});
	});

});

router.get('/auth/google', passport.authenticate('google'));

router.get('/auth/google/callback', passport.authenticate('google', {
	successRedirect: '/home',
	failureRedirect: '/error'
}));

router.get('/auth/bnet', passport.authenticate('bnet'));

router.get('/auth/bnet/callback', passport.authenticate('bnet', {
	successRedirect: '/login',
	failureRedirect: '/error'
}));

router.get('/error', function(req, res, next) {
	res.sender('There was an error logging in.');
});

router.get('/account', isAuthenticated, function(req, res, next) {
	res.render('account', {user:req.user});
});

router.get('/create', isAuthenticated, function(req, res, next) {
	res.render('createRoom', {title: 'Create Room', user:req.user});	
});

router.get('/contact', isAuthenticated, function(req, res, next) {
	res.render('contact', {title: 'Contact Page', user:req.user});
});

router.post('/login', function(req, res, next) {
	if(!req.user) {
		res.redirect('/');
	}
		User = new User({
		username: req.user.name['familyName'],
		});
	res.redirect('/home');
}); 

module.exports = router;
