// See handlebarsjs.com for details. Here, we register
// a re-usable fragment of HTML called a "partial" which
// may be inserted somewhere in the DOM using a function
// call instead of manual insertion of an HTML String.
Handlebars.registerPartial('tweet', Handlebars.templates['tweet']);
Handlebars.registerPartial('allTweet', Handlebars.templates['allTweet']);
Handlebars.registerPartial('follower', Handlebars.templates['follower']);
Handlebars.registerPartial('allUser', Handlebars.templates['allUser']);


// Global variable set when a user is logged in. Note
// that this is unsafe on its own to determine this: we 
// must still verify every server request. This is just 
// for convenience across all client-side code.
currentUser = undefined;

// A few global convenience methods for rendering HTML
// on the client. Note that the loadPage methods below
// fills the main container div with some specified 
// template based on the relevant action.

var loadPage = function(template, data) {
	data = data || {};
	$('#main-container').html(Handlebars.templates[template](data));
};

var loadHomePage = function() {
	if (currentUser) {
		loadTweetsPage();
	} else {
		loadPage('index');
	}
};

/*
  note that loadTweetsPage reads in the data for the user's tweets and all tweets
*/
var loadTweetsPage = function() {
	$.get('/tweets', function(response) {
		loadPage('tweets', { tweets: response.content.tweets, currentUser: currentUser, allTweets: response.content.allTweets, followersTweets: response.content.followersTweets, followers: response.content.followers });
	});
};	

var loadAllTweetsPage = function () {
	$.get('/tweets', function(response) {
		loadPage('allUsersTweets', { tweets: response.content.tweets, currentUser: currentUser, allTweets: response.content.allTweets, followersTweets: response.content.followersTweets, followers: response.content.followers });
	});
}

var loadFollowersTweetsPage = function () {
	$.get('/tweets', function(response) {
		loadPage('allFollowersTweets', { tweets: response.content.tweets, currentUser: currentUser, allTweets: response.content.allTweets, followersTweets: response.content.followersTweets, followers: response.content.followers });
	});	
}

var loadFollowersPage = function () {
	$.get('/tweets', function(response) {
		loadPage('followers', { tweets: response.content.tweets, currentUser: currentUser, allTweets: response.content.allTweets, followersTweets: response.content.followersTweets, followers: response.content.followers, allUsers: response.content.allUsers });
	});	
}

$(document).ready(function() {
	$.get('/users/current', function(response) {
		if (response.content.loggedIn) {
			currentUser = response.content.user;
		}
		loadHomePage();
	});
});

$(document).on('click', '#home-link', function(evt) {
	evt.preventDefault();
	loadHomePage();
});

$(document).on('click', '#signin-btn', function(evt) {
	loadPage('signin');
});

$(document).on('click', '#register-btn', function(evt) {
	loadPage('register');
});

