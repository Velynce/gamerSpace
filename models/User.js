var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	username: {type:String, unique: true, required: true},
	favourites:[{type:mongoose.Schema.ObjectId, ref:'User'}],
	chat:[{type:mongoose.Schema.ObjectId, ref:'Chat'}]
});

module.exports = mongoose.model('User', userSchema);