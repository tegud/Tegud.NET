define(['forms/fieldValidators', 'forms/validator'], function () {

    TEGUD.Forms.DateValidator = (function () {

        return function (dateFieldContainer) {
            var fields = dateFieldContainer.find('input,select')
                    .addClass('date validate-ignore')
                    .on('blur', function() {
                        $(this).removeClass('validate-ignore');
                    }),
                erroredFields,
                errorTypes,
                isValid = true,
                addErrorMessage = function(errorMessage) {
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
                validationFunction = function(value, force) {
                    isValid = true;

                    erroredFields = $([]);
                    errorTypes = [];

                    if (force ===  true) {
                        fields.removeClass('validate-ignore');
                    }

                    fields.each(function () {
                        var field = $(this),
                            hadFocus = !field.hasClass('validate-ignore'),
                            fieldValue = field.val(),
                            parsedFieldValue,
                            setFieldError = function(errorMessage) {
                                isValid = false;
                                addErrorMessage(errorMessage);
                                erroredFields = erroredFields.add(field);
                            };

                        if (!hadFocus && force !== true) {
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

                        if (parsedFieldValue != fieldValue) {
                            setFieldError('Enter a time not a fraction of a day');
                            return true;
                        }

                        if (field.hasClass('day-field') && parsedFieldValue > 31) {
                            setFieldError('No month has more than 31 days.');
                            return true;
                        }

                        if (field.hasClass('month-field') && parsedFieldValue > 12) {
                            setFieldError('There\'s only 12 months in a year.');
                            return true;
                        }
                    });

                    if (isValid && (!fields.filter('.validate-ignore').length || force === true)) {
                        var dateArray = [],
                            dayField = fields.filter('.day-field'),
                            day = parseInt(dayField.val(), 10);

                        $.each(fields.get().reverse(), function(x, item) {
                            dateArray[dateArray.length] = item.value;
                        });

                        var date = moment(dateArray.join('-'));

                        if (date.toString() === 'Invalid Date') {
                            isValid = false;
                            addErrorMessage('That\'s no date');
                            erroredFields = fields;
                        } else if (date.date() !== day) {
                            isValid = false;
                            addErrorMessage('That month doesn\'t have that many days.');
                            erroredFields = dayField;
                        }
                    }

                    fields.removeClass('error');
                    erroredFields.addClass('error');

                    return isValid;
                },
                validator = new TEGUD.Forms.Validator(fields, $('.blog-item-date-error-holder', dateFieldContainer),
                    {
                        defaultErrorClassToggle: false
                    });

            validator.registerCustomValidator('date',
                validationFunction,
                function() {
                    return errorTypes.length ? errorTypes.join('<br/>') : 'That\'s no date.';
                });

            return {
                validate: function () {
                    return validator.validate(true);
                },
                isValid: function () {
                    return isValid;
                }
            };
        };
    })();

});