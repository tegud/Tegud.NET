define(['forms/base'], function () {
    TEGUD.Forms.ValidateMessage = (function () {
        return function (fields, elementToAppendTo) {
            var messageElement,
                messageTextElement,
                spikePositioner,
                insertMessageElement = function () {
                    messageElement = $('<div class="validation-message"></div>')
                        .append(messageTextElement = $('<div></div>'))
                        .appendTo(elementToAppendTo);
                },
                getCurrentSpikes = function () {
                    return $('.validation-message-spike', messageElement);
                },
                updateDisplayedSpikes = function(requiredSpikes) {
                    var existingSpikes = getCurrentSpikes(),
                        x;
                    
                    if (existingSpikes.size() > requiredSpikes) {
                        existingSpikes
                            .filter(':gt(' + (requiredSpikes - 1) + ')')
                            .remove()
                            .length = requiredSpikes;
                    }
                    else if (existingSpikes.size() < requiredSpikes) {
                        var spikeHtml = [];
                        for (x = 0; x < requiredSpikes - existingSpikes.size() ; x++) {
                            spikeHtml[spikeHtml.length] = '<div class="validation-message-spike"></div>';
                        }
                        messageElement.append(spikeHtml.join(''));
                    }

                    return getCurrentSpikes();
                },
                positionSpike = function() {
                    var erroredFields = fields.filter('.error');

                    if (!erroredFields || !erroredFields.length) {
                        return;
                    }

                    var existingSpikes = updateDisplayedSpikes(erroredFields.length),
                        positions = $.map(erroredFields, function (field) {
                            var errorField = $(field);
                            return {
                                left: errorField.position().left + (errorField.width() + 14) / 2,
                                right: 'auto'
                            };
                        });

                    existingSpikes.each(function (x) {
                        $(this).css(positions[x]);
                    });
                };

            return {
                setMessage: function (text) {
                    if (!messageElement) {
                        insertMessageElement();
                    }

                    if (spikePositioner && $.isFunction(spikePositioner)) {
                        spikePositioner(messageElement);
                    }
                    else {
                        positionSpike();
                    }

                    messageTextElement.html(text);
                },
                hideMessage: function () {
                    if (!messageElement) {
                        return;
                    }

                    messageElement.remove();
                    messageElement = undefined;
                },
                setSpikePositioner: function (fn) {
                    spikePositioner = fn;
                }
            };
        };
    })();
});