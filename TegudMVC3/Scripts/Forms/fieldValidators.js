define(['forms/base'], function () {
    var validators = TEGUD.Forms.FieldValidators = (function () {
        var fieldValidators = { },
            fieldValidator = function (fn, errorMessage) {
                return {
                    validate: fn,
                    message: function () {
                        return errorMessage;
                    }
                };
            };

        return {
            createValidator: function(fn, errorMessage) {
                return new fieldValidator(fn, errorMessage);
            },
            registerValidator: function (name, fn, errorMessage) {
                fieldValidators[name] = new fieldValidator(fn, errorMessage);
            },
            getAll: function () {
                return fieldValidators;
            }
        };
    })();

    validators.registerValidator('required',
        function(value) {
            return typeof value !== 'undefined' && value !== '';
        },
        'You need to enter a value.');
    
    validators.registerValidator('numeric',
        function(value) {
            return value !== 'undefined' && !isNaN(value);
        },
        'That\'s not a number');
});