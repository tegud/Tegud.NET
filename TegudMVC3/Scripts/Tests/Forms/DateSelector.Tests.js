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
                    .val('');
        };

    module('TEGUD.Forms.DateSelector', { teardown: tearDown });

    test('new_date_selector_with_no_date_set_returns_undefined', function () {
        var element = buildOrGetDateSelector(),
            dateSelector = new TEGUD.Forms.DateSelector(element),
            expected = undefined;

        equal(dateSelector.val(), expected, 'expected undefined');
    });

    test('date_selector_with_valid_date_returns_that_date', function () {
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

    asyncTest('date_selector_calendar_button_click_appends_datepicker', function () {
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

    asyncTest('date_selector_calendar_button_second_click_hides_datepicker', function () {
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

    asyncTest('calendar_selected_date_changes_when_selector_date_changes', function () {
        
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
            }, 25);

            //tearDown(selectorId);
        }, 25);
    });

});