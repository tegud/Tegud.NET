/// <reference path="qunit.js"/>
/// <reference path="../Tegud/base.js"/>
/// <reference path="../Utilities/base.js"/>
/// <reference path="~/Scripts/Tegud/base.js" />
/// <reference path="~/Scripts/Tests/qunit.js" />
/// <reference path="~/Scripts/moment.js" />

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

        element.find('.day-field').trigger('blur');

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
                .trigger('blur')
                .end()
            .find('.month-field')
                .val(4)
                .trigger('blur')
                .end()
            .find('.year-field')
                .val(2012)
                .trigger('blur');

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

            setTimeout(function () {
                equal($('.datepickerSelected', element).text(), '10', 'expected day to be the 10th');
                equal($('.datepickerMonth', element).text(), 'February, 2012', 'expected month and year to be the February, 2012');


                start();

                tearDown(selectorId);
            }, 25);
        }, 25);
    });

    asyncTest('validation is not triggered when date selector is blank and calendar button is clicked', function () {
        var selectorId = 'calendar-toggle-no-validation-change-test',
            element = buildOrGetDateSelector(selectorId);

        new TEGUD.Forms.DateSelector(element);

        $('.blog-item-date-icon', element).trigger('click');

        setTimeout(function () {
            ok(!$('.blog-item-date-error-holder', element).children().length, 'No error messages should be present');

            start();

            tearDown(selectorId);
        }, 25);
    });

    asyncTest('calendar is correctly populated when no date has been selected', function () {
        var selectorId = 'calendar-toggle-no-validation-change-test',
            element = buildOrGetDateSelector(selectorId);

        new TEGUD.Forms.DateSelector(element);

        $('.blog-item-date-icon', element).trigger('click');

        setTimeout(function () {
            notEqual($('.datepickerWeek:first', element).text(), 'NaN', 'Text should not be "NaN"');

            start();

            tearDown(selectorId);
        }, 25);
    });
});