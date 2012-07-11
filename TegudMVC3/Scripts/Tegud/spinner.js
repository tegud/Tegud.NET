define(['tegud/base'], function () {
    var defaultOptions = {
        timeout: 200
    };

    TEGUD.Spinner = function (element, options) {
        options = $.extend({ }, options, defaultOptions);

        var spinnerTimeoutInMilliseconds = options.timeout,
					spinnerTimeout,
					spinnerAnimateNext,
					spinnerItems = element.children(),
					spinnerSequence = options.sequence,
					sequencePosition = -1;

        (spinnerAnimateNext = function () {
            var getNext = function (items) {
                var nextIndex = sequencePosition++,
								nextItem;

                if (sequencePosition > spinnerSequence.length) {
                    sequencePosition = 1;
                    nextIndex = 0;
                }


                return items.eq(spinnerSequence[nextIndex]);
            },
						next = getNext(spinnerItems);

            spinnerItems.filter('.on').removeClass('on');

            next.addClass('on');

            spinnerTimeout = setTimeout(spinnerAnimateNext, spinnerTimeoutInMilliseconds);
        })();

        return {
            pause: function () {
                clearTimeout(spinnerTimeout);
            },
            start: function () {
                spinnerAnimateNext();
            },
            restart: function () {
                clearTimeout(spinnerTimeout);
                sequencePosition = -1;
                spinnerAnimateNext();
            }
        };
    };
});