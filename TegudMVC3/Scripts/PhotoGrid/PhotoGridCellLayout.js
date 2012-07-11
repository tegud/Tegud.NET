define(['tegud/base', 'utilities/base'], function () {
    TEGUD.PhotoGridCellLayout = function (container, groups) {
        var headerLayout = new TEGUD.PhotoGridHeaderImageLayout(container, $.map(groups, function (item) {
            return $.extend(item.getHeaderImage(), {
                name: item.name,
                getAllContainedMedia: item.getAllContainedMedia
            });
        })),
            topLeftBoundary = headerLayout.topLeftBoundary(),
            snapToGrid = function (dimension, maxSizeBoundary) {
                if (dimension % 80 === 0) {
                    return dimension;
                }

                var canFitGridSquares = Math.floor(dimension / 80);

                return maxSizeBoundary ? (canFitGridSquares * 80) + 5 : dimension - canFitGridSquares * 80;
            },
            startLeft = snapToGrid(topLeftBoundary.x),
            left = startLeft,
            top = snapToGrid(topLeftBoundary.y),
            maxLeft = snapToGrid(container.width() - left, true),
            maxTop = snapToGrid(container.height() - top, true),
            gridSize = 80,
            imageDictionary = {},
            id = 0;

        while (left <= maxLeft && top <= maxTop) {
            if (!headerLayout.positionOverlapsHeader(left, top)) {
                var itemId = 'grid-item-' + id;

                headerLayout.attachGridItemToNearestHeader(itemId, left, top);

                imageDictionary[itemId] = {
                    id: itemId,
                    top: top,
                    left: left
                };

                id++;
            }

            left += gridSize;

            if (left > maxLeft) {
                left = startLeft;
                top += gridSize;
            }
        }


        return {
            render: function () {
                var html = [];

                html[html.length] = headerLayout.render();

                html[html.length] = '<div class="small-image-grid">';

                headerLayout.iterate(function (i, currentHeaderImage) {
                    var sortedImages = _.sortBy(currentHeaderImage.closestGridImages, function (item) {
                            return item.distance;
                        }),
                        sortedImagesLength = sortedImages.length,
                        sortedImageCounter = 0,
                        imageIndex = 0,
                        maxDistance = 0,
                        gridImageHtml = [];

                    for (; sortedImageCounter < sortedImagesLength; sortedImageCounter++) {
                        if (sortedImageCounter > currentHeaderImage.smallImages.length || !currentHeaderImage.smallImages[imageIndex]) {
                            break;
                        }

                        if (sortedImages[sortedImageCounter].distance > maxDistance) {
                            maxDistance = sortedImages[sortedImageCounter].distance;
                        }

                        gridImageHtml[gridImageHtml.length] = '<div id="' +
                                sortedImages[sortedImageCounter].id + '" class="small-image-grid-item" data-distance="' +
                                sortedImages[sortedImageCounter].distance + '" style="top: ' +
                                imageDictionary[sortedImages[sortedImageCounter].id].top + 'px; left: ' +
                                imageDictionary[sortedImages[sortedImageCounter].id].left + 'px;"><img src="' +
                                currentHeaderImage.smallImages[imageIndex].square.url + '" /></div>';

                        imageIndex++;
                    }

                    html[html.length] = '<div class="header-image-grid ' + currentHeaderImage.id + '-group" data-max-distance="' + maxDistance + '">';
                    html[html.length] = gridImageHtml.join('');
                    html[html.length] = '</div>';
                });

                html[html.length] = '</div>';

                return html.join('');
            }
        };
    };
});
