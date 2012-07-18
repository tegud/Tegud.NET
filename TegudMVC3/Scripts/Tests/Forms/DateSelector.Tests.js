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

    module('TEGUD.Forms.DateSelector', { teardown: tearDown });

    test('new date selector with invalid date set returns undefined', function () {
        var element = buildOrGetDateSelector(),
            dateSelector = new TEGUD.Forms.DateSelector(element),
            expected = undefined;

        equal(dateSelector.val(), expected, 'expected undefined');
    });

    test('date selector with valid date returns that date', function () {
        var element = buildOrGetDateSelector(),
            dateSelector = new TEGUD.Forms.DateSelector(element),
            formatString = 'D M YYYY',
            expected = moment(new Date(2012, 3, 25)).format(formatString),
            actualValue;

        element
            .find('.day-field')
                .val(25)
                .end()
            .find('.month-field')
                .val(4)
                .end()
            .find('.year-field')
                .val(2012);

        actualValue = dateSelector.val().format(formatString);

        equal(actualValue, expected, 'expected 25 4 2012');
    });
    
    asyncTest('date selector calendar button click appends datepicker', function () {
        var selectorId = 'calendar-test',
            element = buildOrGetDateSelector(selectorId);

        new TEGUD.Forms.DateSelector(element);
        $('.blog-item-date-icon', element)
            .trigger('click');

        setTimeout(function () {
            ok($('.datepicker', element).length, 'expected datepicker element to exist');

            start();

            tearDown(selectorId);
        }, 25);
    });

    asyncTest('date selector calendar button second click hides datepicker', function () {
        var selectorId = 'calendar-hide-test',
            element = buildOrGetDateSelector(selectorId),
            calendarIcon;

        new TEGUD.Forms.DateSelector(element);

        calendarIcon = $('.blog-item-date-icon', element).trigger('click');

        setTimeout(function () {
            calendarIcon = calendarIcon.trigger('click');

            setTimeout(function () {
                ok($('.blog-item-calendar-container', element).hasClass('hidden'), 'expected datepicker element to be hidden');

                start();

                tearDown(selectorId);
            }, 25);
        }, 25);
    });

    asyncTest('calendar selected date changes when selector date changes', function () {
        
        var selectorId = 'calendar-date-change-test',
            element = buildOrGetDateSelector(selectorId);

        new TEGUD.Forms.DateSelector(element);

        $('.blog-item-date-icon', element).trigger('click');

        setTimeout(function () {
            element
                .find('.day-field')
                    .val(10)
                    .end()
                .find('.month-field')
                    .val(2)
                    .end()
                .find('.year-field')
                    .val(2012)
                    .trigger('change');

            setTimeout(function() {
                equal($('.datepickerSelected', element).text(), '10', 'expected day to be the 10th');
                equal($('.datepickerMonth', element).text(), 'February, 2012', 'expected month and year to be the February, 2012');
                

                start();
                
                tearDown(selectorId);
            }, 25);
        }, 25);
    });

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

    test('when date value is negative isValid returns false', function () {
        var element = buildOrGetDateSelector(),
            dateValidator = new TEGUD.Forms.DateValidator(element);

        element
            .find('.day-field')
                .val(-25)
                .end()
            .find('.month-field')
                .val(4)
                .end()
            .find('.year-field')
                .val(2012);

        ok(!dateValidator.isValid(), 'isValid should return false');
    });

    test('is valid appends error message when date field is negative', function () {
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

        new TEGUD.Forms.DateValidator(element).isValid();

        equal($('.blog-item-date-error-holder', element).children(':first').text(), 'Negative values make no sense', 'Error message should be "Negative values make no sense"');
    });

    test('is valid appends error message when year field is negative', function () {
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

        new TEGUD.Forms.DateValidator(element).isValid();

        equal($('.blog-item-date-error-holder', element).children(':first').text(), 'Negative values make no sense', 'Error message should be "Negative values make no sense"');
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