define(['tegud/base', 'tegud/holdbutton', 'forms/validator'], function () {
    TEGUD.NumberSpinner = (function () {
        var KEY_UP = 38,
            KEY_DOWN = 40,
            MAX_VALUE_KEY = 'max',
            MIN_VALUE_KEY = 'min';

        return function (element) {
            var field = $('input', element),
                settings = { },
                getValue = function () {
                    return parseInt(field.val(), 10);
                },
                shiftSpinnerDigit = function (by) {
                    var fieldValue = field.val();

                    if (!fieldValue || isNaN(fieldValue)) {
                        return;
                    }
                    else {
                        fieldValue = parseInt(fieldValue, 10);
                    }

                    fieldValue = fieldValue + by;

                    if ((by < 0 && settings[MIN_VALUE_KEY] !== undefined && fieldValue < settings[MIN_VALUE_KEY])
                        || (by > 0 && settings[MAX_VALUE_KEY] !== undefined && fieldValue > settings[MAX_VALUE_KEY])) {
                        return;
                    }

                    field.val(fieldValue);
                },
                setValue = function(value) {
                    field.val(value);
                    fieldValidator.validate();
                },
                self;

            element
                .on('keydown', 'input', function(e) {
                    if (e.keyCode === KEY_UP || e.keyCode === KEY_DOWN) {
                        shiftSpinnerDigit(e.keyCode === KEY_UP ? 1 : -1);

                        field.select();

                        return false;
                    }
                });

            var fieldValidator = new TEGUD.Forms.Validator(field, $('#blog-item-series-part-field-container'));
            
            var spinnerButtons = new TEGUD.HoldButton($('.number-spinner-control', element),
                function () {
                    var button = $(this);
                    shiftSpinnerDigit(button.hasClass('number-spinner-up') ? 1 : -1);
                    fieldValidator.validate();
                });


            fieldValidator.registerCustomValidator('RangeValidator',
                function () {
                    var fieldValue = parseInt(field.val(), 10);
                    return (settings[MIN_VALUE_KEY] === undefined || fieldValue >= settings[MIN_VALUE_KEY])
                        && (settings[MAX_VALUE_KEY] === undefined || fieldValue <= settings[MAX_VALUE_KEY]);
                },
                function () {
                    var min = settings[MIN_VALUE_KEY],
                        max = settings[MAX_VALUE_KEY];

                    if(min === undefined) {
                        return 'Value must be below ' + max;
                    }
                    
                    if (max === undefined) {
                        return 'Value must be above ' + min;
                    }

                     return 'Value must be between ' + min + ' and ' + max;
                });

            field.addClass('RangeValidator');

            self = {
                set: function (key, value) {
                    if(typeof arguments[0] === 'object') {
                        $.extend(settings, arguments[0]);

                        return self;
                    }

                    settings[key] = value;

                    return self;
                },
                get: function(key) {
                    return settings[key];
                },
                val: function () {
                    if (arguments.length) {
                        return setValue(arguments[0]);
                    }

                    return getValue();
                }
            };

            return self;
        };
    })();
});