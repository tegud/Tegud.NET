﻿define(['moment', 'forms/dateValidator', 'forms/dateSelectorCalendar'], function () {
    
    TEGUD.Forms.DateSelector = (function () {
        return function (dateFieldContainer) {
            var dateValidator = new TEGUD.Forms.DateValidator(dateFieldContainer),
                dateFields = $('input, select', dateFieldContainer),
                setCurrentValue = function(value) {
                    dateFields
                        .removeClass('validate-ignore')
                        .filter('.day-field')
                            .val(value.getDate())
                        .end()
                        .filter('.month-field')
                            .val(value.getMonth() + 1)
                        .end()
                        .filter('.year-field')
                            .val(value.getFullYear());

                    dateValidator.isValid();
                },
                getCurrentValue = function() {
                    var dateArray = [],
                        isValid = true;

                    $.each(dateFields.get().reverse(), function (x, item) {
                        if (!item.value || isNaN(item.value)) {
                            isValid = false;
                            return false;
                        }

                        dateArray[dateArray.length] = item.value;
                    });

                    if (!isValid) {
                        return;
                    }

                    return moment(dateArray.join('-'));
                },
                self = {
                    val: function () {
                        if (arguments[0]) {
                            setCurrentValue(arguments[0]);
                            return self;
                        }

                        return getCurrentValue();
                    }
                },
                calendar;
            
            dateFieldContainer
                .on('click', '.blog-item-date-icon', function () {
                    if (!calendar) {
                        calendar = new TEGUD.Forms.DateSelectorCalendar(self, $('#blog-item-calendar-container'));
                        return;
                    }

                    calendar.toggle();
                })
                .on('change', 'input, select', function () {
                    if (!calendar || !dateValidator.isValid()) {
                        return;
                    }
                    
                    calendar.resetValueToSelectorCurrent();
                });

            return self;
        };
    })();

});