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

  $(document).on('click', '.delete-tweet', function(evt) {
      var item = $(this).parent();
      var id = item.data('tweet-id');
      $.ajax({
          url: '/tweets/' + id,
          type: 'DELETE'
      }).done(function(response) {
          item.remove();
          window.location.reload(true);
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
