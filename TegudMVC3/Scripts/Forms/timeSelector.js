define(['moment', 'forms/timeValidator', 'utilities/base'], function () {

    var padNumber = TEGUD.Utilities.PadNumberForTime,
        formatterRegex = /(hh?|HH?|mm?|a|A)/g,
        timeFormatters = {
        'h': function (hour) {
            return hour > 12 ? hour - 12 : hour;
        },
        'hh': function (hour) {
            return padNumber(timeFormatters['h'](hour));
        },
        'H': function (hour) {
            return hour;
        },
        'HH': function (hour) {
            return padNumber(timeFormatters['H'](hour));
        },
        'm': function(hour, minute) {
            return minute;
        },
        'mm': function (hour, minute) {
            return padNumber(timeFormatters['m'](hour, minute));
        },
        'a': function (hour) {
            return hour > 11 ? 'pm' : 'am';
        },
        'A': function (hour) {
            return (timeFormatters['a'](hour) + '').toUpperCase();
        }
    };

    TEGUD.Forms.TimeSelector = (function () {
        return function (timeFieldContainer) {
            var timeValidator = new TEGUD.Forms.TimeValidator(timeFieldContainer),
                hourField = $('.hour-field', timeFieldContainer),
                minuteField = $('.minute-field', timeFieldContainer),
                self = {
                    format: function (format) {
                        var hour = parseInt(hourField.val(), 10),
                            minute = parseInt(minuteField.val(), 10),
                            tokens = format.match(formatterRegex),
                            i,
                            tokensLength = tokens.length;

                        for (i = 0; i < tokensLength; i++) {
                            format = format.replace(tokens[i], timeFormatters[tokens[i]](hour, minute));
                        }

                        return format;
                    },
                    val: function () {
                        if (!timeValidator.isValid()) {
                            return;
                        }

                        return self.format('HH:mm');
                    }
                };
            
            return self;
        };
    })();

});