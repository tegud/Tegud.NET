(function () {
    var _checkForErrorAndDisplay = function (response) {
        return response.Error;
    },
        defaultErrorHandler = function (error) {
            // TODO: Replace with jQuery UI Alert.
            alert(error);
        };

    TEGUD.ajax = (function () {
        return function (controller, action, data, options) {
            var url = '/' + controller + '/' + action,
                onComplete = function (response) {
                    if (options.onComplete && $.isFunction(options.onComplete)) {
                        options.onComplete(response);
                    }
                },
                onError = function (xhr, status, response) {
                    handleError('Request failed, please try again.');

                    onComplete(response);
                },
                handleError = function (error) {
                    if (options.onError && $.isFunction(options.onError)) {
                        options.onError(error);
                    }
                    else {
                        defaultErrorHandler(error);
                    }
                },
                onSuccess = function (response) {
                    var error = _checkForErrorAndDisplay(response);

                    if (error) {
                        handleError(error);
                        return;
                    }

                    if (options.onSuccess && $.isFunction(options.onSuccess)) {
                        options.onSuccess(response);
                    }

                    onComplete(response);
                };

            return $.ajax({
                url: url,
                type: 'POST',
                contentType: 'application/json',
                success: onSuccess,
                error: onError
            });
        };
    })();
})();