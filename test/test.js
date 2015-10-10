var assert = require("assert");
var User = require("./../models/User")
var utils = require("./../utils/utils")

describe('User', function () { 

  // createNewUser start
  describe('#createNewUser()', function () {

    it('should add a new user', function () {

      // create new user
      User.createNewUser('izzy','hunter2', function(err, user) {
        if (err) {
          if (err.taken) {
            return 'That username is already taken!';
          } else {
            return 'An unknown error has occurred.';
          }
        } else {
          return user.username;
        }
      });

      assert.equal(true, User.isUser('izzy'));
    });

    it('should NOT add a new user; taken', function () {
      var PASSED = false;

      User.createNewUser('izzy', 'whatever_lol', function(err, user) {
        if (err!==null) {
          PASSED = true;
        }
      });

      assert.equal(true, PASSED);
    });
  });

  // findByUsername start
  describe('#findByUsername()', function () {

    it('should find user', function () {
      var PASSED = false;

      // 'izzy' already added in createNewUser test
      User.findByUsername('izzy', function(err, user) {
        if (!err) {
          PASSED = true;
        }
      });

      assert.equal(true, PASSED);
    });

    it('should NOT find user', function () {
      var PASSED = false;
      // do NOT create a new user

      User.findByUsername('dude', function(err, user) {
        if (err!==null) {
          PASSED = true;
        }
      });

      assert.equal(true, PASSED);
    });
  });

  // verifyPassword start
  describe('#verifyPassword()', function () {
    
    it('should verify password', function() {
      var PASSED = false;

      User.verifyPassword('izzy', 'hunter2', function (err, crrctPass) {
        if (crrctPass) {
          PASSED = true;
        }
      });

      assert.equal(true, PASSED);
    });

    it('should NOT verify password', function () {
      var PASSED = false;

      User.verifyPassword('izzy', 'wrongpassword', function (err, crrctPass) {
        if (!crrctPass) {
          PASSED = true;
        }
      });

      assert.equal(true, PASSED);
    });
  });

  // addTweet start
  describe('#addTweet()', function () {
    
    it('should add tweet successfully', function () {
      var PASSED = false;

      User.addTweet('izzy', 'my first tweet!', function (err) {
        if (err===null) {
          PASSED = true;
        }
      });

      assert.equal(true, PASSED);
    });

    it('should NOT add tweet successfully; invalid username', function () {
      var PASSED = false;

      User.addTweet('robert', 'my first tweet!', function (err) {
        if (err!==null) {
          PASSED = true;
        }
      });

      assert.equal(true, PASSED);
    });
  });

  // getTweet start
  describe('#getTweet()', function () {
    
    it('should get tweet successfully', function () {
      var PASSED = false;

      User.getTweet('izzy', '0', function (err, tweet) {
        if (err===null) {
          PASSED = true;
        }
      });

      assert.equal(true, PASSED);
    });

    it('should NOT get tweet successfully; invalid Id', function () {
      var PASSED = false;

      User.getTweet('izzy', '100', function (err, tweet) {
        if (err!==null) {
          PASSED = true;
        }
      });

      assert.equal(true, PASSED);
    });

    it('should NOT get tweet successfully; invalid username', function () {
      var PASSED = false;

      User.getTweet('robert', '0', function (err, tweet) {
        if (err!==null) {
          PASSED = true;
        }
      });

      assert.equal(true, PASSED);
    });
  });

  // getTweets start
  describe('#getTweets()', function () {
    
    it('should get tweets successfully', function () {
      var PASSED = false;

      User.getTweets('izzy', function (err, userTweets, allTweets) {
        if (err===null) {
          PASSED = true;
        }
      });

      assert.equal(true, PASSED);
    });

    it('should NOT get tweets successfully', function () {
      var PASSED = false;

      User.getTweets('robert', function (err, userTweets, allTweets) {
        if (err!==null) {
          PASSED = true;
        }
      });

      assert.equal(true, PASSED);
    });
  });

  // updateTweet start
  describe('#updateTweet()', function () {
    
    it('should update tweet successfully', function () {
      var PASSED = false;

      User.updateTweet('izzy', '0', 'edited first tweet!', function (err) {
        if (err===null) {
          PASSED = true;
        }
      });

      assert.equal(true, PASSED);
    });

    it('should NOT update tweet successfully; invalid Id', function () {
      var PASSED = false;

      User.updateTweet('izzy', '100', 'edited first tweet!', function (err) {
        if (err!==null) {
          PASSED = true;
        }
      });

      assert.equal(true, PASSED);
    });

    it('should NOT update tweet successfully; invalid user', function () {
      var PASSED = false;

      User.updateTweet('robert', '0', 'edited first tweet!', function (err) {
        if (err!==null) {
          PASSED = true;
        }
      });

      assert.equal(true, PASSED);
    });
  });

  // removeTweet start
  describe('#removeTweet()', function () {
    
    it('should NOT remove tweet successfully; invalid username', function () {
      var PASSED = false;

      User.removeTweet('robert', '100', function (err) {
        if (err!==null) {
          PASSED = true;
        }
      });

      assert.equal(true, PASSED);
    });

    it('should NOT remove tweet successfully; invalid Id', function () {
      var PASSED = false;

      User.removeTweet('izzy', '1', function (err) {
        if (err!==null) {
          PASSED = true;
        }
      });

      assert.equal(true, PASSED);
    });

    it('should remove tweet successfully', function () {
      var PASSED = false;

      User.removeTweet('izzy', '0', function (err) {
        if (err===null) {
          PASSED = true;
        }
      });

      assert.equal(true, PASSED);
    });
  });

});
