define(['tegud/base', 'utilities/base', 'utilities/jquery.imageloaded', 'PhotoGrid/HeaderImagePosition', 'PhotoGrid/PhotoGridCellLayout',
    'PhotoGrid/PhotoGridHeaderImageLayout', 'PhotoGrid/GridAnimations'], function () {
        TEGUD.PhotoGrid = function (element) {
            var $window = $(window),
                currentGroups,
                parentLevel,
                checkImages = function () {
                    var d = element.children('.photo-grid-headers').imagesLoaded();

                    d
                    .progress(function () {
                        this.addClass('loaded');

                        element
                            .children('.small-image-grid')
                            .children('.' + this.parent().attr('id') + '-group')
                            .imagesLoaded()
                            .progress(function() {
                                var containerDiv = this.parent(),
                                    maxDistance = containerDiv.parent().data('maxDistance'),
                                    distance = containerDiv.data('distance');

                                TEGUD.PhotoGridAnimations[maxDistance && distance ? 'outward' : 'random'](this, distance, maxDistance);
                            });
                    })
                    .always(function () {
                        if (d.state() === 'resolved') {
                            TEGUD.Utilities.publish('TEGUD.Flickr.GridRenderComplete');
                        }
                    });
                },

            renderGrid = function (topLevelGroup) {
                $.when(TEGUD.pageLoadDeferred).then(function () {
                    currentGroups = topLevelGroup.getGroups();

                    element.html(TEGUD.PhotoGridCellLayout($window, currentGroups).render());

                    checkImages();
                });
            };


            element
                .on('mouseover', '.grid-image', function () {
                    var id = $(this).attr('id');

                    element.children('.small-image-grid').children('.' + id + '-group').addClass('header-hover');
                })
                .on('mouseout', '.grid-image', function () {
                    var id = $(this).attr('id');

                    element.children('.small-image-grid').children('.' + id + '-group').removeClass('header-hover');
                })
                .on('click', '.grid-image', function () {
                    var index = $(this).data('groupIndex');

                    renderGrid(currentGroups[index]);
                });

            TEGUD.Utilities.subscribe('TEGUD.Flickr.GroupedPhotosLoaded', function (m, data) {
                renderGrid(data);
            });

            return {

            };
        };
    });