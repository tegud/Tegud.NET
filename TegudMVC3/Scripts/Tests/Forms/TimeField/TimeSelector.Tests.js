/// <reference path="../../qunit.js"/>
/// <reference path="../../jquery.js"/>
/// <reference path="../../../require.js"/>
define(['Forms/TimeSelector'], function () {
    module('TEGUD.Forms.TimeSelector');

    test('time selector with invalid time set returns undefined', function () {
        var element = $('#blog-item-time-fields'),
            timeSelector = new TEGUD.Forms.TimeSelector(element),
            expected = undefined;

        equal(timeSelector.val(), expected, 'Expected time selector to return undefined.');
    });
    
    test('time selector with valid time set returns selected time', function () {
        var element = $('#blog-item-time-fields'),
            timeSelector = new TEGUD.Forms.TimeSelector(element),
            expected = '13:54';

        element
            .find('.hour-field')
                .val(13)
                .end()
            .find('.minute-field')
                .val(54);

        equal(timeSelector.val(), expected, 'Expected time selector to return 13:54');
    });

    test('time selector with hour value under 10 returns number padded by zero', function () {
        var element = $('#blog-item-time-fields'),
            timeSelector = new TEGUD.Forms.TimeSelector(element),
            expected = '01:54';

        element
            .find('.hour-field')
                .val(1)
                .end()
            .find('.minute-field')
                .val(54);

        equal(timeSelector.val(), expected, 'Expected time selector to return 01:54.');
    });

    test('time selector with minute value under 10 returns number padded by zero', function () {
        var element = $('#blog-item-time-fields'),
            timeSelector = new TEGUD.Forms.TimeSelector(element),
            expected = '13:05';

        element
            .find('.hour-field')
                .val(13)
                .end()
            .find('.minute-field')
                .val(5);

        equal(timeSelector.val(), expected, 'Expected time selector to return 13:05.');
    });

    test('format with format string "h" returns 12hour time for time before 12pm', function () {
        var element = $('#blog-item-time-fields'),
            timeSelector = new TEGUD.Forms.TimeSelector(element),
            expected = '3';

        element
            .find('.hour-field')
                .val(3)
                .end()
            .find('.minute-field')
                .val(0);

        equal(timeSelector.format('h'), expected, 'Expected "3".');
    });

    test('format with format string "h" returns 12hour time for time after 12pm', function () {
        var element = $('#blog-item-time-fields'),
            timeSelector = new TEGUD.Forms.TimeSelector(element),
            expected = '1';

        element
            .find('.hour-field')
                .val(13)
                .end()
            .find('.minute-field')
                .val(0);

        equal(timeSelector.format('h'), expected, 'Expected "1".');
    });

    test('format with format string "hh" returns padded 12hour time', function () {
        var element = $('#blog-item-time-fields'),
            timeSelector = new TEGUD.Forms.TimeSelector(element),
            expected = '01';

        element
            .find('.hour-field')
                .val(13)
                .end()
            .find('.minute-field')
                .val(0);

        strictEqual(timeSelector.format('hh'), expected, 'Expected "01".');
    });

    test('format with format string "H" returns 24hour time', function () {
        var element = $('#blog-item-time-fields'),
            timeSelector = new TEGUD.Forms.TimeSelector(element),
            expected = '22';

        element
            .find('.hour-field')
                .val(22)
                .end()
            .find('.minute-field')
                .val(0);

        equal(timeSelector.format('H'), expected, 'Expected "22".');
    });

    test('format with format string "HH" returns 24hour time', function () {
        var element = $('#blog-item-time-fields'),
            timeSelector = new TEGUD.Forms.TimeSelector(element),
            expected = '08';

        element
            .find('.hour-field')
                .val(8)
                .end()
            .find('.minute-field')
                .val(0);

        strictEqual(timeSelector.format('HH'), expected, 'Expected "08".');
    });

    test('format with format string "m" returns minutes', function () {
        var element = $('#blog-item-time-fields'),
            timeSelector = new TEGUD.Forms.TimeSelector(element),
            expected = '5';

        element
            .find('.hour-field')
                .val(22)
                .end()
            .find('.minute-field')
                .val(5);

        equal(timeSelector.format('m'), expected, 'Expected "5".');
    });

    test('format with format string "mm" returns padded minutes', function () {
        var element = $('#blog-item-time-fields'),
            timeSelector = new TEGUD.Forms.TimeSelector(element),
            expected = '05';

        element
            .find('.hour-field')
                .val(22)
                .end()
            .find('.minute-field')
                .val(5);

        equal(timeSelector.format('mm'), expected, 'Expected "05".');
    });

    test('format with format string "a" returns lower case am', function () {
        var element = $('#blog-item-time-fields'),
            timeSelector = new TEGUD.Forms.TimeSelector(element),
            expected = 'am';

        element
            .find('.hour-field')
                .val(4)
                .end()
            .find('.minute-field')
                .val(0);

        equal(timeSelector.format('a'), expected, 'Expected "am".');
    });

    test('format with format string "A" returns upper case AM', function () {
        var element = $('#blog-item-time-fields'),
            timeSelector = new TEGUD.Forms.TimeSelector(element),
            expected = 'AM';

        element
            .find('.hour-field')
                .val(4)
                .end()
            .find('.minute-field')
                .val(0);

        equal(timeSelector.format('A'), expected, 'Expected "AM".');
    });

    test('format with format string "A" returns upper case PM with time after 12pm', function () {
        var element = $('#blog-item-time-fields'),
            timeSelector = new TEGUD.Forms.TimeSelector(element),
            expected = 'PM';

        element
            .find('.hour-field')
                .val(14)
                .end()
            .find('.minute-field')
                .val(0);

        equal(timeSelector.format('A'), expected, 'Expected "PM".');
    });

    test('format with format string "h:m" returns "1:1" when time is set to 13:01', function () {
        var element = $('#blog-item-time-fields'),
            timeSelector = new TEGUD.Forms.TimeSelector(element),
            expected = '1:1';

        element
            .find('.hour-field')
                .val(13)
                .end()
            .find('.minute-field')
                .val(1);

        equal(timeSelector.format('h:m'), expected, 'Expected "1:1".');
    });

    test('format with format string "hh:mm a" returns "01:51 pm" when time is set to 13:51', function () {
        var element = $('#blog-item-time-fields'),
            timeSelector = new TEGUD.Forms.TimeSelector(element),
            expected = '01:51 pm';

        element
            .find('.hour-field')
                .val(13)
                .end()
            .find('.minute-field')
                .val(51);

        equal(timeSelector.format('hh:mm a'), expected, 'Expected "01:51 pm".');
    });

    test('format with format string "HH:mm A" returns "01:51 pm" when time is set to 13:51', function () {
        var element = $('#blog-item-time-fields'),
            timeSelector = new TEGUD.Forms.TimeSelector(element),
            expected = '13:51 PM';

        element
            .find('.hour-field')
                .val(13)
                .end()
            .find('.minute-field')
                .val(51);

        equal(timeSelector.format('HH:mm A'), expected, 'Expected "13:51 PM".');
    });

    test('format with format string "HH HH h" returns "08 08 8" when time is set to 8:00', function () {
        var element = $('#blog-item-time-fields'),
            timeSelector = new TEGUD.Forms.TimeSelector(element),
            expected = '08 08 8';

        element
            .find('.hour-field')
                .val(8)
                .end()
            .find('.minute-field')
                .val(0);

        equal(timeSelector.format('HH HH h'), expected, 'Expected "08 08 8".');
    });
});