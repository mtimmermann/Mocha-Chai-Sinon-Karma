describe('updateTools', function () {
  var testInput = [
    'Test',
    0,
    1,
    -1,
    null,
    undefined
  ];

  describe('#updateMessage()', function () {
    it('should add the given message to a target DOM element', function () {
      var $textStub = sinon.stub($.fn, 'text');

      testInput.forEach(function (input) {
        updateTools.updateMessage(input);

        assert.isTrue($textStub.calledWithExactly(input));

        $textStub.reset();
      });

      $textStub.restore();
    });
  });

  describe('#alwaysHandler()', function () {
    it('should handle the ajax response', function () {
      var updateMessageSpy = sinon.spy(updateTools, 'updateMessage');

      var response = {};
      updateTools.alwaysHandler(response);
      assert.isTrue(updateMessageSpy.calledWithExactly(updateTools.ERROR_MESSAGE));

      response.success = false;
      updateTools.alwaysHandler(response);
      assert.isTrue(updateMessageSpy.calledWithExactly(updateTools.ERROR_MESSAGE));

      response.success = true;
      updateTools.alwaysHandler(response);
      assert.isTrue(updateMessageSpy.calledWithExactly(updateTools.SUCCESS_MESSAGE));

      updateMessageSpy.restore();
    });
  });

  describe('#update()', function () {
    var server;
    var responseJson;
    var serverResponse = [
      200,
      { 'Content-Type': 'application/json' },
      ''
    ];
    var doneStub;
    var failStub;

    before(function () {
      server = sinon.fakeServer.create();
      alwaysStub = sinon.stub(updateTools, 'alwaysHandler');
    });
    afterEach(function () {
      alwaysStub.reset();
    });
    after(function () {
      server.restore();
      alwaysStub.restore();
    });

    it('should update successfully', function () {
      // Prepare the response
      var responseJson = {
        success: true
      };
      serverResponse[2] = JSON.stringify(responseJson);

      server.respondWith('POST', '/update', serverResponse);

      var data = {
        foo: 'bar'
      };
      updateTools.update(data);

      server.respond();

      assert.isTrue(alwaysStub.calledOnce);
    });

    it('should update successfully with but with an invalid JSON response', function () {
      // Prepare the response
      var responseJson = {
        foo: 'bar'
      };
      serverResponse[2] = JSON.stringify(responseJson);

      server.respondWith('POST', '/update', serverResponse);

      var data = {
        foo: 'bar'
      };
      updateTools.update(data);

      server.respond();

      assert.isTrue(alwaysStub.calledOnce);
    });

    it('should fail to update', function () {
      // Prepare the response
      serverResponse[0] = 404;

      server.respondWith('POST', '/update', serverResponse);

      var data = {
        foo: 'bar'
      };
      updateTools.update(data);

      server.respond();

      assert.isTrue(alwaysStub.calledOnce);
    });
  });
});
