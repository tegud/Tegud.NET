define(['forms/fieldValidators', 'forms/validator'], function () {

    TEGUD.Forms.TimeValidator = (function () {
        return function (timeFieldContainer) {
            var fields = timeFieldContainer.find('input,select')
                .addClass('date validate-ignore')
                .on('blur', function() {
                    $(this).removeClass('validate-ignore');
                }),
                hourField = $('.hour-field', timeFieldContainer),
                minuteField = $('.minute-field', timeFieldContainer),
                errorTypes = [],
                erroredFields,
                addErrorMessage = function (errorMessage) {
                    var newErrorType = true,
                        x = 0,
                        currnetNumberOfErrorTypes = errorTypes.length;

                    for (; x < currnetNumberOfErrorTypes; x++) {
                        if (errorTypes[x] === errorMessage) {
                            newErrorType = false;
                            break;
                        }
                    }

                    if (newErrorType) {
                        errorTypes[currnetNumberOfErrorTypes] = errorMessage;
                    }
                },
                validationFunction = function (value, force) {
                    var isValid = true;

                    erroredFields = $([]);
                    errorTypes = [];

                    fields.each(function () {
                        var field = $(this),
                            hadFocus = !field.hasClass('validate-ignore'),
                            fieldValue = field.val(),
                            parsedFieldValue,
                            setFieldError = function (errorMessage) {
                                isValid = false;
                                addErrorMessage(errorMessage);
                                erroredFields = erroredFields.add(field);
                            };

                        if (!hadFocus && !force) {
                            return true;
                        }

                        if (!fieldValue) {
                            setFieldError('You have to enter something');
                            return true;
                        }

                        if (isNaN(fieldValue)) {
                            setFieldError('Clearly not a number');
                            return true;
                        }

                        parsedFieldValue = parseInt(fieldValue, 10);

                        if (parsedFieldValue < 1) {
                            setFieldError('Negative values make no sense');
                            return true;
                        }
                        
                        if (fieldValue.indexOf('.') > -1) {
                            setFieldError('Must be a whole number');
                            return true;
                        }
                        
                        if(field.hasClass('hour-field') && parsedFieldValue > 23) {
                            setFieldError('Can\'t have hours over 23');
                        }
                        else if (field.hasClass('minute-field') && parsedFieldValue > 59) {
                            setFieldError('Only 60 minutes in an hour, and zero counts as one');
                        }
                    });

                    return isValid;
                },
                validator = new TEGUD.Forms.Validator(fields, timeFieldContainer,
                    {
                        defaultErrorClassToggle: false
                    });

            validator.registerCustomValidator('time',
                validationFunction,
                function() {
                    return errorTypes.length ? errorTypes.join('<br/>') : 'That\'s no time.';
                });

            return {
                isValid: function() {
                    return validator.validate(true);
                }
            };
        }
    })();

});