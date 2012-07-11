/// <reference path="qunit.js"/>
/// <reference path="../Tegud/base.js"/>
/// <reference path="../Utilities/base.js"/>

(function () {
    module('TEGUD.Utilities.GetDaySuffix');

    test('when_date_ends_in_one_day_suffix_is_st', function () {
        var expectedSuffix = 'st';

        expect(3);
        equals(TEGUD.Utilities.GetDaySuffix(1), expectedSuffix);
        equals(TEGUD.Utilities.GetDaySuffix(21), expectedSuffix);
        equals(TEGUD.Utilities.GetDaySuffix(31), expectedSuffix);
    });
})();