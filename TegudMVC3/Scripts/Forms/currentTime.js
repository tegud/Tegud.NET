define(['utilities/base', 'forms/base'], function () {
    var tegud = TEGUD,
        utilities = tegud.Utilities,
        calculateTimeToNextMinute = function () {
            var seconds = new Date().getSeconds();

            return (60 - seconds) * 1000;
        };

    tegud.Forms.CurrentTime = (function () {
        return function (currentDateTimeSpan) {
            var refreshCurrentDateTimeSpan = function () {
                    var currentDateTime = new Date(),
                        currentDate = currentDateTime.getDate();

                    currentDateTimeSpan.text(currentDate
                        + utilities.GetDaySuffix(currentDate) + ' '
                        + utilities.GetMonthNameFromNumber(currentDateTime.getMonth()) + ' '
                        + currentDateTime.getFullYear() + ', '
                        + utilities.PadNumberForTime(currentDateTime.getHours()) + ':'
                        + utilities.PadNumberForTime(currentDateTime.getMinutes()));

                    setTimeout(refreshCurrentDateTimeSpan, calculateTimeToNextMinute());
                };

            refreshCurrentDateTimeSpan();
        };
    })();
});