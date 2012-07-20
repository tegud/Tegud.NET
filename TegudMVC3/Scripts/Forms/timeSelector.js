define(['moment', 'forms/timeValidator', 'utilities/base'], function () {
    
    TEGUD.Forms.TimeSelector = (function () {
        return function (timeFieldContainer) {
            var timeValidator = new TEGUD.Forms.TimeValidator(timeFieldContainer),
                self = {
                    val: function () {
                        var hourField = $('.hour-field', timeFieldContainer),
                            minuteField = $('.minute-field', timeFieldContainer);

                        if (hourField.val() && minuteField.val()
                            && !isNaN(hourField.val()) && !isNaN(minuteField.val())
                            && hourField.val().indexOf('.') < 0
                            && minuteField.val().indexOf('.') < 0) {
                            var hour = parseInt(hourField.val(), 10),
                                minute = parseInt(minuteField.val(), 10);

                            if (hour >= 0 && minute >= 0
                                && hour < 24 && minute < 60) {
                                return TEGUD.Utilities.PadNumberForTime(hour) + ':' + TEGUD.Utilities.PadNumberForTime(minute);
                            }
                        }

                        return;
                    }
                };
            
            return self;
        };
    })();

});