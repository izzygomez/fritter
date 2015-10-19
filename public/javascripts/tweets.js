// Wrapped in an immediately invoked function expression.
(function() {
  $(document).on('click', '#submit-new-tweet', function(evt) {
      var content = $('#new-tweet-input').val();
      if (content.trim().length === 0) {
          alert('Input must not be empty');
          return;
      }
      $.post(
          '/tweets',
          { content: content }
      ).done(function(response) {
          loadHomePage();
      }).fail(function(responseObject) {
          var response = $.parseJSON(responseObject.responseText);
          $('.error').text(response.err);
      });
  });

  $(document).on('click', '#my-tweets', function(evt) {
      loadHomePage();
  });

  $(document).on('click', '#all-users-tweets', function(evt) {
      loadAllTweetsPage();
  });

  $(document).on('click', '#followers-tweets', function(evt) {
      loadFollowersTweetsPage();
  });

  $(document).on('click', '#followers', function(evt) {
      loadFollowersPage();
  });

  $(document).on('click', '.delete-tweet', function(evt) {
      var item = $(this).parent();
      var id = item.data('tweet-id');
      $.ajax({
          url: '/tweets/' + id,
          type: 'DELETE'
      }).done(function(response) {
          item.remove();
      }).fail(function(responseObject) {
          var response = $.parseJSON(responseObject.responseText);
          $('.error').text(response.err);
      });
  });

  $(document).on('click', '.edit-tweet', function(evt) {
      var item = $(this).parent();
      item.after(Handlebars.templates['edit-tweet']({
          id: item.data('tweet-id'),
          existingText: item.find('p').text()
      }));
      item.hide();
  });

  $(document).on('click', '.toggle-follow-bttn', function(evt) {
      var item = $(this).parent().parent();
      var username = item.data('username');
      $.post(
        '/follow',
        { username: username }
      ).done(function(response) {
          loadFollowersPage();
      }).fail(function(responseObject) {
          console.log('Something\'s gone terribly wrong!');
      });
  });

  $(document).on('click', '.retweet', function(evt) {
      var item = $(this).parent().parent();
      var content = item.data('content');
      var creator = item.data('creator');
      var newContent = "RT@" + creator + ":\"" + content + "\""

      $.post(
          '/tweets',
          { content: newContent }
      ).done(function(response) {
          loadHomePage();
      }).fail(function(responseObject) {
          var response = $.parseJSON(responseObject.responseText);
          $('.error').text(response.err);
      });

  });

  $(document).on('click', '.cancel-button', function(evt) {
      var item = $(this).parent();
      item.prev().show();
      item.remove();
  });

  $(document).on('click', '.submit-button', function(evt) {
      var item = $(this).parent();
      var id = item.data('tweet-id');
      var content = item.find('input').val();
      if (content.trim().length === 0) {
          alert('Input must not be empty');
          return;
      }
      $.post(
          '/tweets/' + id,
          { content: content }
      ).done(function(response) {
          item.after(Handlebars.templates['tweet']({
              _id: id,
              content: content
          }));
          item.prev().remove();
          item.remove();
      }).fail(function(responseObject) {
          var response = $.parseJSON(responseObject.responseText);
          $('.error').text(response.err);
      });
  });
})();
