define(['forms/base', 'forms/ValidateMessage', 'forms/fieldValidators'], function () {
    var defaultOptions = {
        defaultErrorClassToggle: true
    };

    TEGUD.Forms.Validator = (function () {
        return function (field, appendMessageTo, settings) {
            var validateMessage,
                customValidators = {},
                options = $.extend({}, defaultOptions, settings),
                self;
            
                if(!appendMessageTo) {
                    appendMessageTo = field.parent();
                }

            validateMessage = new TEGUD.Forms.ValidateMessage(field, appendMessageTo);

            validate = function() {
                var classes = field[0].className.split(' '),
                    classLength = classes.length,
                    x = 0,
                    isValid = true,
                    fieldValidators = $.extend(TEGUD.Forms.FieldValidators.getAll(), customValidators),
                    currentValidator,
                    failureMessage;

                if (field.is(':visible')) {
                    for (; x < classLength; x++) {
                        currentValidator = fieldValidators[classes[x]];
                        if (!currentValidator) {
                            continue;
                        }

                        if (!currentValidator.validate(field.val())) {
                            isValid = false;
                            failureMessage = currentValidator.message();
                            break;
                        }
                    }
                }

                if (isValid) {
                    field.removeClass('error');
                    validateMessage.hideMessage();
                } else {
                    if (options.defaultErrorClassToggle) {
                        field.filter(':not(.validate-ignore)').addClass('error');
                    }
                    validateMessage.setMessage(failureMessage);
                }

                return isValid;
            };
            self = {
                validate: validate,
                registerCustomValidator: function(name, fn, message) {
                    customValidators[name] = TEGUD.Forms.FieldValidators.createValidator(fn, message);
                },
                setSpikePositioner: function(fn) {
                    validateMessage.setSpikePositioner(fn);
                }
            };

            if(!field[0].className) {
                return self;
            }

            field
                .on('blur', validate)
                .on('change', validate);

            return self;
        };
    })();
});