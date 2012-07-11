define(['tegud/base'], function () {
    TEGUD.HoldButton = (function () {
        var defaultSettings = {
            timeout: 1000,
            minTimeout: 50,
            timeToMin: 4000
        };

        return function (element, callback, settings) {
            var timeout,
                start = function () {
                    var button = this,
                        elapsedTime = 0,
                        getTimeout = function () {
                            if (!elapsedTime || !settings.minTimeout || settings.timeout === settings.minTimeout) {
                                return settings.timeout;
                            }

                            if(elapsedTime >= settings.timeToMin) {
                                return settings.minTimeout;
                            }
                            
                            return settings.timeout - (elapsedTime / settings.timeToMin) * (settings.timeout - settings.minTimeout);
                        },
                        shift = function () {
                            var iterationTimeout = getTimeout();
                            callback.call(button);
                            elapsedTime += iterationTimeout;
                            timeout = setTimeout(shift, iterationTimeout);
                        };

                    shift();
                },
                stop = function () {
                    clearTimeout(timeout);
                };

            settings = $.extend(defaultSettings, settings);

            element
                .on('mousedown', start)
                .on('mouseup', stop);
        };
    })();
});