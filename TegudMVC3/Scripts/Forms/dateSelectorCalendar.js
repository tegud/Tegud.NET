define(['datepicker', 'moment', 'tegud/base', 'forms/base'], function () {
    TEGUD.Forms.DateSelectorCalendar = (function () {
        return (function(dateSelector, container) {
            var isVisible,
                calendar,
                getDateSelectorValueOrDefault = function() {
                    var dateSelectorDate = dateSelector.val();
                    return dateSelectorDate ? dateSelectorDate : moment(new Date());
                },
                formatMomentForCalendar = function(moment) {
                    return moment.format('YYYY-MM-DD');
                },
                setCalendarToSelectorCurrent = function() {
                    calendar.DatePickerSetDate(formatMomentForCalendar(getDateSelectorValueOrDefault()), true);
                },
                startDate = formatMomentForCalendar(getDateSelectorValueOrDefault()),
                appendCalendar = function() {
                    isVisible = true;
                    calendar = container.DatePicker({
                        flat: true,
                        date: startDate,
                        current: startDate,
                        starts: 1,
                        onChange: function() {
                            dateSelector.val(calendar.DatePickerGetDate());
                        }
                    });

                    container
                        .on('click', '.blog-item-calendar-jump-to > li', function () {
                            var item = $(this),
                                jumpToAfterToday = item.data('jumpToDaysAfterToday'),
                                newDate;

                            if (typeof jumpToAfterToday === 'undefined') {
                                return;
                            }

                            newDate = moment(new Date()).add('d', jumpToAfterToday);

                            dateSelector.val(newDate.toDate());
                            calendar.DatePickerSetDate(formatMomentForCalendar(newDate), true);
                        });
                },
                self = {
                    toggle: function(show) {
                        if (typeof show === 'undefined') {
                            show = !isVisible;
                        }

                        if (show) {
                            container
                                .removeClass('hidden')
                                .parent()
                                .addClass('calendar-visible');
                            if (calendar) {
                                setCalendarToSelectorCurrent();
                            }
                        } else {
                            container
                                .addClass('hidden')
                                .parent()
                                .removeClass('calendar-visible');
                        }
                        isVisible = show;
                    },
                    resetValueToSelectorCurrent: function() {
                        if (!isVisible) {
                            return;
                        }

                        setCalendarToSelectorCurrent();
                    }
                };

            self.toggle(true);
            appendCalendar();

            return self;
        });
    })();

});