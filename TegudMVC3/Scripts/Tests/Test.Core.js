/// <reference path="qunit.js"/>
/// <reference path="../require.js"/>

QUnit.config.autostart = false;

define(['forms/dateSelector'], function () {
    QUnit.start();
    
    module("Date Selector Tests");

    test("Test core methods", function () {
        expect(2);

        equals(1, 1, "A trivial test");
        ok(true, "Another trivial test");
    });
    
});