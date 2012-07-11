(function () {
    TEGUD.registerNameSpace('TEGUD.Sidebar.Blog');

    TEGUD.registerInit(function (archiveData) {
        var sidebarPanel = $('#BlogArchive'),
            years = sidebarPanel.children('.Years'),
            article = sidebarPanel.children('article'),
            defaultArticleLeft = article.position().left,
            x,
            archiveDataLength = archiveData.length,
            panelHeight = 90,
            newHeight,
            pageUrl = document.location.href,
            archiveIndex = pageUrl.indexOf('/Archive/');

        // Extract the years for the header.
        years.html($.map(archiveData, function (item, i) {
            return '<li data-tegud-year-index="' + i + '" data-tegud-year="' + item.Year + '"><h4>' + item.Year + '</h4></li>';
        }).join(''));

        // Cufon replace the years.
        Cufon.replace(years);

        // find the largest number of months, and us that to calculate the height of the panel.
        for (x = 0; x < archiveDataLength; x++) {
            newHeight = archiveData[x].Months.length * 30;
            if (newHeight > panelHeight) {
                panelHeight = newHeight;
            }
        }

        sidebarPanel.animate({ height: panelHeight + 10 }, 500);

        // Initialise the Metro header.
        TEGUD.Metro.Header(years);

        years.delegate('li', 'selectItem', function (e, previousItem) {
            var tweetIndex = $(this).data('tegudYearIndex'),
                year = parseInt($(this).text(), 10),
                returnArticle = function () {
                    article
                        .css('left', article.width())
                        .html('<ul>' + $.map(archiveData[tweetIndex].Months, function (item, i) {
                            return '<li><a href="/Archive/' + year + '/' + TEGUD.Utilities.GetMonthNumberFromName(item.Month) + '">' + item.Month + ' (' + item.Quantity + ')</a></li>';
                        }).join('') + '</ul>')
                        .animate({
                            left: defaultArticleLeft
                        },
                            250);
                };

            if (previousItem && $(previousItem).length) {
                article.animate({
                    left: -article.width()
                },
                    250,
                    returnArticle);
            }
            else {
                returnArticle();
            }
        });

        if (archiveIndex > -1) {
            initialYear = parseInt(pageUrl.substring(archiveIndex + 9).substring(0, 4), 10);

            years.children('[data-tegud-year="' + initialYear + '"]').trigger('click');
        }
        else {
            years.children(':first').trigger('click');
        }

    }, 'BlogArchive');
})();