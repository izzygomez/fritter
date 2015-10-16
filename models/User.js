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

//////////// STATICS ////////////

//////// PRIVATE

// DONE
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

// DONE
var getAllUsers = function (callback) {
	User.find({}, function (err, users) {
		if (err) throw err;
		console.log("Got all users!");
		callback(users);
	})
}

// DONE
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

//////// PUBLIC

// DONE
userSchema.statics.findByUsername = function (username, callback) {
	getUser(username, function (user) {
		if (user===null) {
			callback({ msg: 'No such user!' });
		} else {
			callback(null, user);
		}
	});
}

// DONE
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

// DONE
userSchema.statics.createNewUser = function (username, password, callback) {
	userExists(username, function (err) {
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


			// TESTING GROUNDS LOL DELETE FROM HERE DOWN AFTER DONE WITH EVERYTHING

			// getUser(username, function(user) {
			// 	if (user===null) {
			// 		console.log("some shit went down");
			// 	} else {
			// 		console.log("printing out user info:");
			// 		console.log(user);
			// 		console.log(user.username);
			// 		console.log(user.password);
			// 		console.log(user.following);
			// 		console.log(user.tweets);
			// 	}
			// });

			// User.verifyPassword(username, password, function (x, isVerified) {
			// 	if (isVerified) {
			// 		console.log("This user password combination is verified!");
			// 	} else {
			// 		console.log("Incorrect password!");
			// 	}
			// });

			// User.verifyPassword(username, "password", function (x, isVerified) {
			// 	if (isVerified) {
			// 		console.log("This user password combination is verified!");
			// 	} else {
			// 		console.log("Incorrect password!");
			// 	}
			// });
			
			// console.log("Adding tweet to user");

			// User.addTweet(username, {content: "this is gonna be my first tweet!", creator: username}, function () {});

			// User.addTweet(username, {content: "bitch", creator: username}, function () {
			// 	User.getTweets(username, function(err, userTweets, allTweets) {
			// 		if (err) throw err;
			// 		console.log("I MADE IT MA");
			// 		console.log("...");
			// 		console.log(userTweets);
			// 		console.log("...");
			// 		console.log(allTweets);
			// 		console.log("...");
			// 	});
			// });

			// DON'T DELETE THIS
			callback(null, username);
		}
	});
}

// DONE
userSchema.statics.getTweet = function (username, tweetId, callback) {
	getUser(username, function (user) {
		if (user===null) {
			callback({msg: 'Invalid user'});
		} else {
			var tweet = user.tweets.filter(function(tw){
				return tw._id === tweetId;
			});

			if (tweet.length===1) {
				callback(null, tweet[0]);
			} else {
				callback({ msg: 'Invalid tweet Id.'});
			}
		}
	});
}

// DONE
userSchema.statics.getTweets = function (username, callback) {
	console.log('ive arrived here');
	console.log(username);
	getUser(username, function (user) {
		if (user===null) {
			callback({ msg: 'Invalid user' });
		} else {
			var allTweets = [];
			// TODO uncomment this
			// getAllUsers(function (users) {
			// 	users.forEach( function (someUser, index, array) {
			// 		someUser.tweets.forEach( function (tweet, index, array) {
			// 			allTweets.push(tweet);
			// 		});
			// 	});
			// });
			console.log("got here boyy");
			console.log(user.tweets);

			callback(null, user.tweets, []);
		}
	});
}

// DONE
userSchema.statics.addTweet = function (username, tweet, callback) {
	getUser(username, function (user) {
		if (user===null) {
			callback({msg: 'Invalid user.'});
		} else {
			tweet._id = Date.now();
			tweet.createDate = new Date().toString();

			var conditions = { username: user.username };
			var update = { $push: { tweets: tweet } };
			User.update(conditions, update, function () {
				console.log("successfully added tweet to "+user.username+"!");
			});
			callback(null);
		}
	});
}

// DONE no need to implement
// userSchema.statics.updateTweet = function (username, tweetId, newContent, callback) {
// 	// TODO implement
// }

// userSchema.statics.removeTweet = function (username, tweetId, callback) {
// 	// TODO implement
// }

var User = mongoose.model('User', userSchema);

module.exports = User;