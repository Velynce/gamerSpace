var mongoose = require('mongoose');

var chatSchema = new mongoose.Schema({
	game: {type:String, required:[true, 'need to provide a game'], maxlength: 30}, 
	name: {type:String, required:[true, 'need to provide a chat name'], maxlength: 20},
	privateChat:{type:String, require:[true, 'need to provide a yes or no'], maxlength: 2},
	createdBy: {type:mongoose.Schema.ObjectId, ref:'User'}
});

module.exports = mongoose.model('Chat', chatSchema);