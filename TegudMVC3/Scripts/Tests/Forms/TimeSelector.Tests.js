/// <reference path="qunit.js"/>
/// <reference path="../Tegud/base.js"/>
/// <reference path="../Utilities/base.js"/>

define(['Forms/TimeSelector'], function () {
    module('TEGUD.Forms.TimeSelector');

    test('new_time_selector_with_no_time_set_returns_undefined', function () {
        var timeSelector = new TEGUD.Forms.TimeSelector($('#blog-item-time-fields')),
            expected = undefined;

        equal(timeSelector.val(), expected, 'Expected time selector to return undefined.');
    });
});