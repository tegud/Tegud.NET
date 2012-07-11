define(['tegud/base'], function () {
    var t = TEGUD;

    t.registerInit(function () {
        $('body')
            .delegate('.ViewDemo', 'click', function (e) {
                $(this).find('a').trigger('click');
            })
            .delegate('.ViewDemo a', 'click', function (e) {
                e.stopPropagation();

                var a = $(this),
                    link = a.attr('href');

                if (!link) {
                    return false;
                }

                window.open(link, a.attr('target'));

                return false;
            });
    });
});