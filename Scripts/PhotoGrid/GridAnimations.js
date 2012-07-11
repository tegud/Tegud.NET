define(['tegud/base'], function () {
    TEGUD.PhotoGridAnimations = (function() {
        return {
            random: function(item) {
                setTimeout(function() { item.addClass('loaded'); }, Math.floor(Math.random() * 301) + 250);
            },
            outward: function(item, distance, maxDistance) {
                setTimeout(function() { item.addClass('loaded'); }, (distance / maxDistance) * 600);
            },
            immediate: function(item) {
                item.addClass('loaded');
            }
        };
    })();
});
