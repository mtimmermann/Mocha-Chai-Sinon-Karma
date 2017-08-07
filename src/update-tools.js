var updateTools = {
  SUCCESS_MESSAGE: 'Update succesfull at: ',
  ERROR_MESSAGE: 'Update fail at: ',
  update: function (updateData) {
    $.ajax({
        method: 'POST',
        url: '/update',
        data: {
          updateData: updateData
        }
    }).always(this.alwaysHandler);
  },
  alwaysHandler: function (response) {
    var timestamp = Date();
    var message = this.ERROR_MESSAGE;
    try {
      if (response.success) {
        message = this.SUCCESS_MESSAGE;
      }
      this.updateMessage(message);
    }
    catch (error) {
      this.updateMessage(message);
    }
  },
  updateMessage: function (message) {
    $('#message').text(message);
  }
};
