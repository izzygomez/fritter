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

// Private methods

var getUser = function (username, callback) {
	userExists(username, function (err) {
		if (err) {
			if (err.alreadyExists) {
				User.find({ username: username }).lean().exec(function (err, users) {
					callback(users[0]);
				});
			}
		} else {
			callback(null);
		}
	});
}

var getAllUsers = function (callback) {
	User.find({}, function (err, users) {
		if (err) throw err;
		callback(users);
	})
}

var userExists = function (username, callback) {
	User.count({ username: username }, function (err, c) {
		if (err) throw err;
		if (c>=1) {
			callback({ alreadyExists: true });
		} else {
			callback(null);
		}
	});	
}

// Public methods

userSchema.statics.findByUsername = function (username, callback) {
	getUser(username, function (user) {
		if (user===null) {
			callback({ msg: 'No such user!' });
		} else {
			callback(null, user);
		}
	});
}

userSchema.statics.verifyPassword = function (username, candidatepw, callback) {
	getUser(username, function (user) {
		if (user===null) {
			callback(null, false);
		} else {
			if (candidatepw === user.password) {
				callback(null, true);
			} else {
				callback(null, false);
			}
		}
	});
}

userSchema.statics.createNewUser = function (username, password, callback) {
	userExists(username, function (err) {
		if (err) {
			if (err.alreadyExists) {
				callback({ taken: true });
			}
		} else {
			var newUser = User({
				username: username,
				password: password,
				tweets: [],
				following: []
			});

			newUser.save(function (err) {
				if (err) throw err;
			});

			callback(null, username);
		}
	});
}

userSchema.statics.getTweet = function (username, tweetId, callback) {
	getUser(username, function (user) {
		if (user===null) {
			callback({msg: 'Invalid user'});
		} else {
			var tweet = user.tweets.filter(function(tw){
				return tw._id === parseInt(tweetId);
			});

			if (tweet.length===1) {
				callback(null, tweet[0]);
			} else {
				callback({ msg: 'Invalid tweet Id.'});
			}
		}
	});
}

userSchema.statics.getTweets = function (username, callback) {
	getUser(username, function (user) {
		if (user===null) {
			callback({ msg: 'Invalid user' });
		} else {
			var allTweets = [];
			var followersTweets = [];
			var allUsers = [];
			getAllUsers(function (users) {
				users.forEach( function (someUser, index, array) {
					someUser.tweets.forEach( function (tweet, index, array) {
						allTweets.push(tweet);
						if (user.following.indexOf(someUser.username)!==-1) {
							followersTweets.push(tweet);
						}
					});
					allUsers.push(someUser);
				});

				callback(null, user.tweets, allTweets, followersTweets, allUsers);
			});
		}
	});
}

userSchema.statics.addTweet = function (username, tweet, callback) {
	getUser(username, function (user) {
		if (user===null) {
			callback({msg: 'Invalid user.'});
		} else {
			tweet._id = Date.now();

			var conditions = { username: user.username };
			var update = { $push: { tweets: tweet } };
			User.update(conditions, update, function () {});
			callback(null);
		}
	});
}

userSchema.statics.removeTweet = function (username, tweetId, callback) {
	getUser(username, function (user) {
		if (user===null) {
			callback({ msg: 'Invalid user' });
		} else {
			User.getTweet(username, tweetId, function (err, tweet) {
				if (err) throw err;
				// remove only the tweet w the given tweet_id
				updatedTweets = user.tweets.filter(function (el) {return el._id !== tweetId});

				var conditions = { username: user.username };
				var update = { $set: { tweets: updatedTweets} };
				User.update(conditions, update, function () {});
				callback(null);
			});
		}
	});
}

userSchema.statics.toggleFollow = function (username, followingUser, callback) {
	getUser(followingUser, function (followingUser) {
		if (followingUser===null) {
			callback({msg: 'Invalid user to follow'});
		} else {
			getUser(username, function (user) {
				if (user===null) {
					callback({msg: 'Invalid username provided'});
				}
				if (user.following.indexOf(followingUser.username)===-1) {
					var conditions = { username: username }; 
					var update = { $push: { following: followingUser }};
					User.update(conditions, update, function () {});
					callback(null);
				} else {
					var conditions = { username: username }; 
					var update = { $pull: { following: followingUser }};
					User.update(conditions, update, function () {});
					callback(null);
				}
			});
		}
	});
}

var User = mongoose.model('User', userSchema);

module.exports = User;