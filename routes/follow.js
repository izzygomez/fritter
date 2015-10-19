var express = require('express');
var router = express.Router();
var utils = require('../utils/utils');

var User = require('../models/User');

/*
  Require authentication on ALL access to /follow/*
  Clients which are not logged in will receive a 403 error code.
*/
var requireAuthentication = function(req, res, next) {
  if (!req.currentUser) {
    utils.sendErrResponse(res, 403, 'Must be logged in to use this feature.');
  } else {
    next();
  }
};

/*
  For create and edit requests, require that the request body
  contains a 'username' field. Send error code 400 if not.
*/
var requireUsername = function(req, res, next) {
  if (!req.body.username) {
    utils.sendErrResponse(res, 400, 'Content required in request.');
  } else {
    next();
  }
};

router.all('*', requireAuthentication);
router.post('*', requireUsername);

/*
  TODO
*/
router.post('/', function (req, res) {
  User.toggleFollow(
    req.currentUser.username,
    req.body.username,
    function(err) {
      if (err) {
        utils.sendErrResponse(res, 500, 'An unknown error occured.');
      } else {
        utils.sendSuccessResponse(res);
      }
    })
});

module.exports = router;  