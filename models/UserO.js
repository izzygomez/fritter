// Data for each User is stored in memory instead of in
// a database. This store (and internal code within the User model)
// could in principle be replaced by a database without needing to
// modify any code in the controller.
var _store = { };

// Model code for a User object in the Fritter app.
// Each User object stores a username, password, and collection
// of tweets. Each tweet has some textual content and is specified
// by the owner's username as well as an ID. Each ID is unique
// only within the space of each User, so a (username, tweetID)
// uniquely specifies any tweet.
var User = (function User(_store) {

  var that = Object.create(User.prototype);

  // PRIVATE FUNCTIONS
  /*
    returns boolean of whether indicated user exists
  */
  var userExists = function(username) {
    return _store[username] !== undefined;
  }

  /*
    returns user
  */
  var getUser = function(username) {
    if (userExists(username)) {
      return _store[username];
    }
  }

  // PUBLIC FUNCTIONS
  /*
    returns user publicly
  */
  that.findByUsername = function (username, callback) {
    if (userExists(username)) {
      callback(null, getUser(username));
    } else {
      callback({ msg : 'No such user!' });
    }
  }

  /*
    verifies that provided password for user is correct
  */
  that.verifyPassword = function(username, candidatepw, callback) {
    if (userExists(username)) {
      var user = getUser(username);
      if (candidatepw === user.password) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    } else {
      callback(null, false);
    }
  }

  /*
    creates a new user if user not already created
  */
  that.createNewUser = function (username, password, callback) {
    if (userExists(username)) {
      callback({ taken: true });
    } else {
      _store[username] = { 'username' : username,
                 'password' : password,
                 'tweets' : [] };
      callback(null, getUser(username));
    }
  };

  /*
    gets tweet of username by tweetId
  */
  that.getTweet = function(username, tweetId, callback) {
    if (userExists(username)) {
      var user = getUser(username);
      if (user.tweets[tweetId]) {
        var tweet = user.tweets[tweetId];
        callback(null, tweet);
      } else {
        callback({ msg : 'Invalid tweet. '});
      }
    } else {
      callback({ msg : 'Invalid user. '});
    }
  };

  /*
    returns tweets of current user, and tweets of all users
  */
  that.getTweets = function(username, callback) {
    if (userExists(username)) {
      var user = getUser(username);

      var allTweets = [];
      var users = Object.keys(_store);
      users.forEach( function (element, index, array) {
        var user = getUser(element);
        user.tweets.forEach( function (element, index, array) {
          allTweets.push(element);
        });
      });

      callback(null, user.tweets, allTweets);
    } else {
      callback({ msg : 'Invalid user.' });
    }
  }

  /*
    adds a tweet to the current user
  */
  that.addTweet = function(username, tweet, callback) {
    if (userExists(username)) {
      var user = getUser(username);
      tweet._id = user.tweets.length;
      user.tweets.push(tweet);
      callback(null);
    } else {
      callback({ msg : 'Invalid user.' });
    }
  };

  /*
    updates current user's tweet; this feature currently deprecated, but
    the code has been left here in case it's re-enabled in a future version
    of this program
  */
  that.updateTweet = function(username, tweetId, newContent, callback) {
    if (userExists(username)) {
      var tweets = getUser(username).tweets;
      if (tweets[tweetId]) {
        tweets[tweetId].content = newContent;
        callback(null);
      } else {
        callback({ msg : 'Invalid tweet.' });
      }
    } else {
      callback({ msg : ' Invalid user.' });
    }
  };

  /*
    removes one of current user's tweet, according to tweetId
  */
  that.removeTweet = function(username, tweetId, callback) {
    if (userExists(username)) {
      var tweets = getUser(username).tweets;
      if (tweets[tweetId]) {
        delete tweets[tweetId];
        callback(null);
      } else {
        callback({ msg : 'Invalid tweet.' });
      }
    } else {
      callback({ msg : 'Invalid user.' });
    }
  };

  Object.freeze(that);
  return that;

})(_store);

module.exports = User;