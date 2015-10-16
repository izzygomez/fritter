// grab the things that we need
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test');

var Schema = mongoose.Schema;

// create a schema
var userSchema = new Schema({
	username: String,
	password: String,
	tweets: [],	
	following: []
});

// Methods 
// TODO differentiate between private and public methods

// PRIVATE
userSchema.methods.getUser = function (username) {
	// TODO
}

// PUBLIC
userSchema.methods.findByUsername = function (username, callback) {
	// TODO
}

userSchema.methods.verifyPassword = function (username, candidatepw, callback) {
	// TODO
}

userSchema.methods.isUser = function (username) {
	// TODO
}

userSchema.methods.getTweet = function (username, tweetId, callback) {
	// TODO
}

userSchema.methods.getTweets = function (username, callback) {
	// TODO
}

userSchema.methods.addTweet = function (username, tweet, callback) {
	// TODO
}

userSchema.methods.updateTweet = function (username, tweetId, newContent, callback) {
	// TODO
}

userSchema.methods.removeTweet = function (username, tweetId, callback) {
	// TODO
}

// STATICS
userSchema.statics.userExists = function (username, callback) {
	this.count({ username: username }, function (err, c) {
		if (err) throw err;
		if (c>=1) {
			console.log("User "+username+" already exists!");
			callback({ alreadyExists: true });
		} else {
			callback(null);
		}
	});	
}

userSchema.statics.createNewUser = function (username, password, callback) {

	this.userExists(username, function (err) {
		if (err) {
			if (err.alreadyExists) {
				callback({ taken: true });
			}
		} else {
			console.log("Creating new user...");

			var newUser = User({
				username: username,
				password: password,
				tweets: [],
				following: []
			});

			newUser.save(function (err) {
				if (err) throw err;
				console.log('User successfully stored in database!');
			});

			callback(null, username);
		}
	});
}

var User = mongoose.model('User', userSchema);

module.exports = User;