/// <reference path="qunit.js"/>
/// <reference path="../Tegud/base.js"/>
/// <reference path="../Utilities/base.js"/>

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

    test('is valid returns false when all fields are empty', function () {
        var element = buildOrGetDateSelector(),
            dateValidator = new TEGUD.Forms.DateValidator(element);

        ok(!dateValidator.isValid(), 'isValid should return false');
    });

    test('is valid appends error message when all fields are empty', function () {
        var element = buildOrGetDateSelector();

        new TEGUD.Forms.DateValidator(element).isValid();

        ok($('.blog-item-date-error-holder', element).children().length, 'Error message should be appended');
        equal($('.blog-item-date-error-holder', element).text(), 'You have to enter something', 'Error message should be "You have to enter something"');
    });

    test('is valid returns true when selector is set to valid date', function () {
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

        ok(dateSelector.isValid(), 'isValid should be true');
    });

    test('no error message is displayed when is valid is true', function () {
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

        new TEGUD.Forms.DateValidator(element).isValid();

        ok(!$('.blog-item-date-error-holder', element).children().length, 'No error messages should be present');
    });

    test('is valid is false and appends error message when date field is empty', function () {
        var element = buildOrGetDateSelector();

        element
            .find('.month-field')
                .val(4)
                .end()
            .find('.year-field')
                .val(2012);

        var isValid = new TEGUD.Forms.DateValidator(element).isValid();

        ok(!isValid, 'isValid should return false');
        equal($('.blog-item-date-error-holder', element).children(':first').text(), 'You have to enter something', 'Error message should be "You have to enter something"');
    });

    test('is valid is false and appends error message when month field is empty', function () {
        var element = buildOrGetDateSelector();

        element
            .find('.day-field')
                .val(25)
                .end()
            .find('.year-field')
                .val(2012);

        var isValid = new TEGUD.Forms.DateValidator(element).isValid();

        ok(!isValid, 'isValid should return false');
        equal($('.blog-item-date-error-holder', element).children(':first').text(), 'You have to enter something', 'Error message should be "You have to enter something"');
    });

    test('is valid is false and appends error message when year field is empty', function () {
        var element = buildOrGetDateSelector();

        element
            .find('.day-field')
                .val(25)
                .end()
            .find('.month-field')
                .val(4);

        var isValid = new TEGUD.Forms.DateValidator(element).isValid();

        ok(!isValid, 'isValid should return false');
        equal($('.blog-item-date-error-holder', element).children(':first').text(), 'You have to enter something', 'Error message should be "You have to enter something"');
    });

    test('is valid is false and appends error message when date field is negative', function () {
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

        var isValid = new TEGUD.Forms.DateValidator(element).isValid();

        ok(!isValid, 'isValid should return false');
        equal($('.blog-item-date-error-holder', element).children(':first').text(), 'Negative values make no sense', 'Error message should be "Negative values make no sense"');
    });

    test('is valid is false and appends error message when year field is negative', function () {
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

        var isValid = new TEGUD.Forms.DateValidator(element).isValid();

        ok(!isValid, 'isValid should return false');
        equal($('.blog-item-date-error-holder', element).children(':first').text(), 'Negative values make no sense', 'Error message should be "Negative values make no sense"');
    });

    test('is valid is false and appends error message when year day does not exist for month', function () {
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

        var isValid = new TEGUD.Forms.DateValidator(element).isValid();

        ok(!isValid, 'isValid should return false');
        equal($('.blog-item-date-error-holder', element).children(':first').text(), 'That month doesn\'t have that many days.', 'Error message should be "That month doesn\'t have that many days."');
    });

    test('is valid appends one error message when two fields are invalid for the same reason', function () {
        var element = buildOrGetDateSelector();

        element
            .find('.year-field')
                .val(2012);

        new TEGUD.Forms.DateValidator(element).isValid();
        
        var messages = $('.validation-message', element).children('div:first').html().split('<br>');

        equal(messages.length, 1, 'There should only be one error message per reason');
    });

    test('is valid appends two error message when two fields are invalid for the distinct reasons', function () {
        var element = buildOrGetDateSelector();

        element
            .find('.year-field')
                .val(2012.5);

        new TEGUD.Forms.DateValidator(element).isValid();

        var messages = $('.validation-message', element).children('div:first').html().split('<br>');

        equal(messages.length, 2, 'There should only be two error messages displayed');
        equal(messages[0], 'You have to enter something', 'First message should be "You have to enter something"');
        equal(messages[1], 'Enter a time not a fraction of a day', 'First message should be "Enter a time not a fraction of a day"');
    });
});