/// <reference path="qunit.js"/>
/// <reference path="../Tegud/base.js"/>
/// <reference path="../Utilities/base.js"/>
/// <reference path="~/Scripts/Tests/qunit.js" />
/// <reference path="~/Scripts/Tegud/base.js" />

define(['Forms/DateSelector'], function () {
    var defaultId = '#date-field-container',
        appendSelector = function (id) {
            var element = $('#' + id);
            if (element.length) {
                return element;
            }

            return $(defaultId)
                .clone()
                .attr('id', id)
                .appendTo('body');
        },
        buildOrGetDateSelector = function(id) {
            if (!id) {
                return $(defaultId);
            }

            return appendSelector(id);
        },
        tearDown = function (id) {
            if (id) {
                $('#' + id).remove();
                return;
            }

            $(defaultId)
                .find('.day-field')
                    .val('')
                    .end()
                .find('.month-field')
                    .val('')
                    .end()
                .find('.year-field')
                    .val('')
                    .end()
                .find('.blog-item-date-error-holder')
                    .html('');
        };

    module('TEGUD.Forms.DateValidator', { teardown: tearDown });

    test('validate returns false when all fields are empty', function () {
        var element = buildOrGetDateSelector(),
            dateValidator = new TEGUD.Forms.DateValidator(element);

        ok(!dateValidator.validate(), 'validate should return false');
    });

    test('validate appends error message when all fields are empty', function () {
        var element = buildOrGetDateSelector();

        new TEGUD.Forms.DateValidator(element).validate();

        ok($('.blog-item-date-error-holder', element).children().length, 'Error message should be appended');
        equal($('.blog-item-date-error-holder', element).text(), 'You have to enter something', 'Error message should be "You have to enter something"');
    });

    test('validate returns true when selector is set to valid date', function () {
        var element = buildOrGetDateSelector(),
            dateSelector = new TEGUD.Forms.DateValidator(element);

        element
            .find('.day-field')
                .val(25)
                .end()
            .find('.month-field')
                .val(4)
                .end()
            .find('.year-field')
                .val(2012);

        ok(dateSelector.validate(), 'validate should be true');
    });

    test('no error message is displayed when validate is true', function () {
        var element = buildOrGetDateSelector();

        element
            .find('.day-field')
                .val(25)
                .end()
            .find('.month-field')
                .val(4)
                .end()
            .find('.year-field')
                .val(2012);

        new TEGUD.Forms.DateValidator(element).validate();

        ok(!$('.blog-item-date-error-holder', element).children().length, 'No error messages should be present');
    });

    test('validate is false and appends error message when date field is empty', function () {
        var element = buildOrGetDateSelector();

        element
            .find('.month-field')
                .val(4)
                .end()
            .find('.year-field')
                .val(2012);

        var validate = new TEGUD.Forms.DateValidator(element).validate();

        ok(!validate, 'validate should return false');
        equal($('.blog-item-date-error-holder', element).children(':first').text(), 'You have to enter something', 'Error message should be "You have to enter something"');
    });

    test('validate is false and appends error message when month field is empty', function () {
        var element = buildOrGetDateSelector();

        element
            .find('.day-field')
                .val(25)
                .end()
            .find('.year-field')
                .val(2012);

        var validate = new TEGUD.Forms.DateValidator(element).validate();

        ok(!validate, 'validate should return false');
        equal($('.blog-item-date-error-holder', element).children(':first').text(), 'You have to enter something', 'Error message should be "You have to enter something"');
    });

    test('validate is false and appends error message when year field is empty', function () {
        var element = buildOrGetDateSelector();

        element
            .find('.day-field')
                .val(25)
                .end()
            .find('.month-field')
                .val(4);

        var validate = new TEGUD.Forms.DateValidator(element).validate();

        ok(!validate, 'validate should return false');
        equal($('.blog-item-date-error-holder', element).children(':first').text(), 'You have to enter something', 'Error message should be "You have to enter something"');
    });

    test('validate is false and appends error message when date field is negative', function () {
        var element = buildOrGetDateSelector();

        element
            .find('.day-field')
                .val(-25)
                .end()
            .find('.month-field')
                .val(4)
                .end()
            .find('.year-field')
                .val(2012);

        var validate = new TEGUD.Forms.DateValidator(element).validate();

        ok(!validate, 'validate should return false');
        equal($('.blog-item-date-error-holder', element).children(':first').text(), 'Negative values make no sense', 'Error message should be "Negative values make no sense"');
    });

    test('validate is false and appends error message when year field is negative', function () {
        var element = buildOrGetDateSelector();

        element
            .find('.day-field')
                .val(25)
                .end()
            .find('.month-field')
                .val(4)
                .end()
            .find('.year-field')
                .val(-2012);

        var validate = new TEGUD.Forms.DateValidator(element).validate();

        ok(!validate, 'validate should return false');
        equal($('.blog-item-date-error-holder', element).children(':first').text(), 'Negative values make no sense', 'Error message should be "Negative values make no sense"');
    });

    test('validate is false and appends error message when year day does not exist for month', function () {
        var element = buildOrGetDateSelector();

        element
            .find('.day-field')
                .val(31)
                .end()
            .find('.month-field')
                .val(2)
                .end()
            .find('.year-field')
                .val(2012);

        var validate = new TEGUD.Forms.DateValidator(element).validate();

        ok(!validate, 'validate should return false');
        equal($('.blog-item-date-error-holder', element).children(':first').text(), 'That month doesn\'t have that many days.', 'Error message should be "That month doesn\'t have that many days."');
    });

    test('changing date field to 2 when other fields are incomplete does not trigger full date validation', function () {
        var element = buildOrGetDateSelector(),
            validator = new TEGUD.Forms.DateValidator(element);

        element
            .find('.day-field')
                .val(2)
                .trigger('blur');

        var isValid = validator.isValid();

        ok(isValid, 'isValid should return true');
        ok(!$('.blog-item-date-error-holder', element).children().length, 'No error messages should be present');
    });

    test('validate appends one error message when two fields are invalid for the same reason', function () {
        var element = buildOrGetDateSelector();

        element
            .find('.year-field')
                .val(2012);

        new TEGUD.Forms.DateValidator(element).validate();
        
        var messages = $('.validation-message', element).children('div:first').html().split('<br>');

        equal(messages.length, 1, 'There should only be one error message per reason');
    });

    test('validate appends two error message when two fields are invalid for distinct reasons', function () {
        var element = buildOrGetDateSelector();

        element
            .find('.year-field')
                .val(2012.5);

        new TEGUD.Forms.DateValidator(element).validate();

        var messages = $('.validation-message', element).children('div:first').html().split('<br>');

        equal(messages.length, 2, 'There should only be two error messages displayed');
        equal(messages[0], 'You have to enter something', 'First message should be "You have to enter something"');
        equal(messages[1], 'Enter a time not a fraction of a day', 'Second message should be "Enter a time not a fraction of a day"');
    });

    test('is valid returns true if fields have not been focused', function() {
        var element = buildOrGetDateSelector(),
            validator = new TEGUD.Forms.DateValidator(element);

        equal(validator.isValid(), true, 'isValid should return true');
    });

    test('is valid returns false if a field has been focused and is not valid', function () {
        var element = buildOrGetDateSelector(),
            validator = new TEGUD.Forms.DateValidator(element);

        element
            .find('.year-field')
                .val(2012.5)
                .trigger('blur');

        equal(validator.isValid(), false, 'isValid should return false');
    });

    test('three field spikes are appended when all fields are invalid', function () {
        var element = buildOrGetDateSelector(),
            validator = new TEGUD.Forms.DateValidator(element);

        validator.validate();

        equal($('.validation-message-spike', element).size(), 3, 'three spikes should be appended');
    });

    test('one field spike is appended when day field is empty when blurred', function () {
        var element = buildOrGetDateSelector();
        new TEGUD.Forms.DateValidator(element);

        element
            .find('.day-field')
                .trigger('blur');

        equal($('.validation-message-spike', element).size(), 1, 'three spikes should be appended');
    });

    test('when three spikes are appended, then one field is corrected two spikes remain', function () {
        var element = buildOrGetDateSelector();

        new TEGUD.Forms.DateValidator(element).validate();

        equal($('.validation-message-spike', element).size(), 3, 'three spikes should be appended');

        element
            .find('.day-field')
                .val(1)
                .trigger('blur');

        equal($('.validation-message-spike', element).size(), 2, 'two spikes should be appended');
    });

    test('when three spikes are appended, then all fields are corrected no spikes remain', function () {
        var element = buildOrGetDateSelector();

        new TEGUD.Forms.DateValidator(element).validate();

        equal($('.validation-message-spike', element).size(), 3, 'three spikes should be appended');

        element
            .find('.day-field')
                .val(1)
                .end()
            .find('.month-field')
                .val(1)
                .end()
            .find('.year-field')
                .val(2012)
                .trigger('blur');

        equal($('.validation-message-spike', element).size(), 0, 'no spikes should be present');
    });

    test('when one field is invalid, then another field is invalidated, 2 spikes should be appended', function () {
        var id = 'second-spike-test',
            element = buildOrGetDateSelector(id),
            validator = new TEGUD.Forms.DateValidator(element);

        element
            .find('.day-field')
                .val(1)
                .trigger('blur')
                .end()
            .find('.month-field')
                .val(1)
                .trigger('blur');        

        validator.validate();

        equal($('.validation-message-spike', element).size(), 1, 'one spike should be appended');

        element
            .find('.day-field')
                .val(1.5)
                .trigger('blur');

        equal($('.validation-message-spike', element).size(), 2, 'two spike should be appended');

        tearDown(id);
    });
});