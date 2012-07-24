/// <reference path="../../qunit.js"/>
/// <reference path="../../jquery.js"/>
/// <reference path="../../../require.js"/>
define(['Forms/TimeSelector'], function () {
    module('TEGUD.Forms.TimeValidator');

    test('isValid returns false when hour and minute fields are blank', function () {
        var element = $('#blog-item-time-fields'),
            timeSelector = new TEGUD.Forms.TimeValidator(element); 

        equal(timeSelector.isValid(), false, 'Expected isValid to return false');
    });

    test('isValid returns true when hour and minute are set to valid values', function () {
        var element = $('#blog-item-time-fields'),
            timeSelector = new TEGUD.Forms.TimeValidator(element);

        element
            .find('.hour-field')
                .val(13)
                .end()
            .find('.minute-field')
                .val(5);

        equal(timeSelector.isValid(), true, 'Expected isValid to return false');
    });

    test('isValid returns false and error message is set when hour is blank', function () {
        var element = $('#blog-item-time-fields'),
            timeSelector = new TEGUD.Forms.TimeValidator(element);

        element
            .find('.minute-field')
                .val(5);

        equal(timeSelector.isValid(), false, 'Expected isValid to return false');
        equal($('.validation-message', element).children(':first').text(), 'You have to enter something', 'Error message should be "You have to enter something"');
    });

    test('isValid returns false and error message is set when minute is blank', function () {
        var element = $('#blog-item-time-fields'),
            timeSelector = new TEGUD.Forms.TimeValidator(element);

        element
            .find('.hour-field')
                .val(13);

        equal(timeSelector.isValid(), false, 'Expected isValid to return false');
        equal($('.validation-message', element).children(':first').text(), 'You have to enter something', 'Error message should be "You have to enter something"');
    });

    test('isValid returns false and error message is set when hour is negative', function () {
        var element = $('#blog-item-time-fields'),
            timeSelector = new TEGUD.Forms.TimeValidator(element);

        element
            .find('.hour-field')
                .val(-13)
                .end()
            .find('.minute-field')
                .val(5);

        equal(timeSelector.isValid(), false, 'Expected isValid to return false');
        equal($('.validation-message', element).children(':first').text(), 'Negative values make no sense', 'Error message should be "Negative values make no sense"');
    });

    test('isValid returns false and error message is set when minute is negative', function () {
        var element = $('#blog-item-time-fields'),
            timeSelector = new TEGUD.Forms.TimeValidator(element);

        element
            .find('.hour-field')
                .val(13)
                .end()
            .find('.minute-field')
                .val(-5);

        equal(timeSelector.isValid(), false, 'Expected isValid to return false');
        equal($('.validation-message', element).children(':first').text(), 'Negative values make no sense', 'Error message should be "Negative values make no sense"');
    });

    test('isValid returns false and error message is set when hour is not a whole number', function () {
        var element = $('#blog-item-time-fields'),
            timeSelector = new TEGUD.Forms.TimeValidator(element);

        element
            .find('.hour-field')
                .val(1.13)
                .end()
            .find('.minute-field')
                .val(5);

        equal(timeSelector.isValid(), false, 'Expected isValid to return false');
        equal($('.validation-message', element).children(':first').text(), 'Must be a whole number', 'Error message should be "Must be a whole number"');
    });

    test('isValid returns false and error message is set when minute is not a whole number', function () {
        var element = $('#blog-item-time-fields'),
            timeSelector = new TEGUD.Forms.TimeValidator(element);

        element
            .find('.hour-field')
                .val(13)
                .end()
            .find('.minute-field')
                .val(5.2);

        equal(timeSelector.isValid(), false, 'Expected isValid to return false');
        equal($('.validation-message', element).children(':first').text(), 'Must be a whole number', 'Error message should be "Must be a whole number"');
    });
    
    test('isValid returns false and error message is set when hour is greater than 23', function () {
        var element = $('#blog-item-time-fields'),
            timeSelector = new TEGUD.Forms.TimeValidator(element);

        element
            .find('.hour-field')
                .val(24)
                .end()
            .find('.minute-field')
                .val(5);

        equal(timeSelector.isValid(), false, 'Expected isValid to return false');
        equal($('.validation-message', element).children(':first').text(), 'Can\'t have hours over 23', 'Error message should be "Can\'t have hours over 23"');
    });

    test('isValid returns false and error message is set when minute is greater than 59', function () {
        var element = $('#blog-item-time-fields'),
            timeSelector = new TEGUD.Forms.TimeValidator(element);

        element
            .find('.hour-field')
                .val(13)
                .end()
            .find('.minute-field')
                .val(60);

        equal(timeSelector.isValid(), false, 'Expected isValid to return false');
        equal($('.validation-message', element).children(':first').text(), 'Only 60 minutes in an hour, and zero counts as one', 'Error message should be "Only 60 minutes in an hour, and zero counts as one"');
    });
    
    test('is valid appends one error message when two fields are invalid for the same reason', function () {
        var element = $('#blog-item-time-fields'),
            timeSelector = new TEGUD.Forms.TimeValidator(element);

        element
            .find('.hour-field')
                .val(-13)
                .end()
            .find('.minute-field')
                .val(-5);

        timeSelector.isValid();

        var messages = $('.validation-message', element).children('div:first').html().split('<br>');

        equal(messages.length, 1, 'There should only be one error message per reason');
    });

    test('is valid appends two error message when two fields are invalid for distinct reasons', function () {
        var element = $('#blog-item-time-fields'),
            timeSelector = new TEGUD.Forms.TimeValidator(element);

        element
            .find('.minute-field')
                .val(-5);

        timeSelector.isValid();

        var messages = $('.validation-message', element).children('div:first').html().split('<br>');

        equal(messages.length, 2, 'There should only be two error messages displayed');
        equal(messages[0], 'You have to enter something', 'First message should be "You have to enter something"');
        equal(messages[1], 'Negative values make no sense', 'Second message should be "Negative values make no sense"');
    });
});