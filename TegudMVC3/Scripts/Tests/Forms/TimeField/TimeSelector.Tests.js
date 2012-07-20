/// <reference path="../../qunit.js"/>
/// <reference path="../../jquery.js"/>
/// <reference path="../../../require.js"/>
define(['Forms/TimeSelector'], function () {
    module('TEGUD.Forms.TimeSelector');

    test('time selector with no time set returns undefined', function () {
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

        equal(timeSelector.val(), expected, 'Expected time selector to return undefined.');
    });

    test('time selector with blank hour set returns undefined', function () {
        var element = $('#blog-item-time-fields'),
            timeSelector = new TEGUD.Forms.TimeSelector(element),
            expected = undefined;

        element
            .find('.minute-field')
                .val(54);

        equal(timeSelector.val(), expected, 'Expected time selector to return undefined.');
    });

    test('time selector with blank minute set returns undefined', function () {
        var element = $('#blog-item-time-fields'),
            timeSelector = new TEGUD.Forms.TimeSelector(element),
            expected = undefined;

        element
            .find('.hour-field')
                .val(13);

        equal(timeSelector.val(), expected, 'Expected time selector to return undefined.');
    });

    test('time selector with alphanumeric hour set returns undefined', function () {
        var element = $('#blog-item-time-fields'),
            timeSelector = new TEGUD.Forms.TimeSelector(element),
            expected = undefined;

        element
            .find('.hour-field')
                .val('fdsfsdf')
                .end()
            .find('.minute-field')
                .val(54);

        equal(timeSelector.val(), expected, 'Expected time selector to return undefined.');
    });

    test('time selector with alphanumeric minute set returns undefined', function () {
        var element = $('#blog-item-time-fields'),
            timeSelector = new TEGUD.Forms.TimeSelector(element),
            expected = undefined;

        element
            .find('.hour-field')
                .val(13)
                .end()
            .find('.minute-field')
                .val('fsdfsdfsd');

        equal(timeSelector.val(), expected, 'Expected time selector to return undefined.');
    });


    test('time selector with negative hour set returns undefined', function () {
        var element = $('#blog-item-time-fields'),
            timeSelector = new TEGUD.Forms.TimeSelector(element),
            expected = undefined;

        element
            .find('.hour-field')
                .val(-13)
                .end()
            .find('.minute-field')
                .val(54);

        equal(timeSelector.val(), expected, 'Expected time selector to return undefined.');
    });

    test('time selector with negative minute set returns undefined', function () {
        var element = $('#blog-item-time-fields'),
            timeSelector = new TEGUD.Forms.TimeSelector(element),
            expected = undefined;

        element
            .find('.hour-field')
                .val(13)
                .end()
            .find('.minute-field')
                .val(-54);

        equal(timeSelector.val(), expected, 'Expected time selector to return undefined.');
    });

    test('time selector with hour over 23 returns undefined', function () {
        var element = $('#blog-item-time-fields'),
            timeSelector = new TEGUD.Forms.TimeSelector(element),
            expected = undefined;

        element
            .find('.hour-field')
                .val(24)
                .end()
            .find('.minute-field')
                .val(54);

        equal(timeSelector.val(), expected, 'Expected time selector to return undefined.');
    });

    test('time selector with minute over 59 returns undefined', function () {
        var element = $('#blog-item-time-fields'),
            timeSelector = new TEGUD.Forms.TimeSelector(element),
            expected = undefined;

        element
            .find('.hour-field')
                .val(13)
                .end()
            .find('.minute-field')
                .val(60);

        equal(timeSelector.val(), expected, 'Expected time selector to return undefined.');
    });

    test('time selector with minute over 59 returns undefined', function () {
        var element = $('#blog-item-time-fields'),
            timeSelector = new TEGUD.Forms.TimeSelector(element),
            expected = undefined;

        element
            .find('.hour-field')
                .val(13)
                .end()
            .find('.minute-field')
                .val(60);

        equal(timeSelector.val(), expected, 'Expected time selector to return undefined.');
    });

    test('time selector with decimal hour returns undefined', function () {
        var element = $('#blog-item-time-fields'),
            timeSelector = new TEGUD.Forms.TimeSelector(element),
            expected = undefined;

        element
            .find('.hour-field')
                .val(13.5)
                .end()
            .find('.minute-field')
                .val(54);

        equal(timeSelector.val(), expected, 'Expected time selector to return undefined.');
    });

    test('time selector with decimal minute returns undefined', function () {
        var element = $('#blog-item-time-fields'),
            timeSelector = new TEGUD.Forms.TimeSelector(element),
            expected = undefined;

        element
            .find('.hour-field')
                .val(13)
                .end()
            .find('.minute-field')
                .val(54.25);

        equal(timeSelector.val(), expected, 'Expected time selector to return undefined.');
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

        equal(timeSelector.val(), expected, 'Expected time selector to return undefined.');
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

        equal(timeSelector.val(), expected, 'Expected time selector to return undefined.');
    });
});