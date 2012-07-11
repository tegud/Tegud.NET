define(['tegud/base', 'utilities/base'], function () {
    TEGUD.PhotoGridHeaderImageLayout = function (container, images) {
        var x, 
            totalWidth = 5,
            imagePositions = [],
            imageDimensions,
            containerDimensions = {
                width: container.width(),
                height: container.height()
            },
            groupLength = images.length,
            correctHeaderDimensionsForGrid = function (image) {
                var gridSize = 80,
                marginSize = 5,
                widthGridSlots = Math.floor((image.width - marginSize) / gridSize),
                heightGridSlots = Math.floor((image.height - marginSize) / gridSize),
                newWidth = widthGridSlots * gridSize - marginSize,
                newHeight = heightGridSlots * gridSize - marginSize;

                return {
                    width: newWidth,
                    height: newHeight
                };
            },
            adjustedWindowWidth = Math.floor((containerDimensions.width / groupLength) / 80) * 80 * groupLength,
            leftOffset = containerDimensions.width - adjustedWindowWidth,
            left, top,
            randomiseSmallImages = function (allImages) {
                return allImages;
            };

        containerDimensions.width = adjustedWindowWidth;

        for (x = 0; x < groupLength; x++) {
            totalWidth += images[x].width + 5;
        }

        if (totalWidth < containerDimensions.width) {
            for (x = 0; x < groupLength; x++) {
                imageDimensions = correctHeaderDimensionsForGrid(images[x]);
                left = leftOffset
                    + (((containerDimensions.width / groupLength) - (imageDimensions.width)) / 2)
                    + ((containerDimensions.width / groupLength) * x);
                top = (containerDimensions.height - imageDimensions.height) / 2;

                imagePositions[imagePositions.length] = TEGUD.PhotoGridHeaderImagePosition(imageDimensions.width,
                    imageDimensions.height,
                    top,
                    left,
                    images[x].url,
                    images[x].name,
                    x,
                    randomiseSmallImages(images[x].getAllContainedMedia()));
            }
        }

        return {
            iterate: function (callback) {
                $.each(imagePositions, callback);
            },
            topLeftBoundary: function () {
                var x = 0,
                    headerImagePositionsLength = imagePositions.length,
                    minLeft = 0,
                    minTop = 0;

                for (; x < headerImagePositionsLength; x++) {
                    console.log('image - ', minLeft, minTop, headerImagePositionsLength);
                    if (!minLeft || imagePositions[x].left < minLeft) {
                        minLeft = imagePositions[x].left;
                    }

                    if (!minTop || imagePositions[x].top < minTop) {
                        minTop = imagePositions[x].top;
                    }
                }

                return new TEGUD.Utilities.CartesianPoint(minLeft, minTop);
            },
            positionOverlapsHeader: function (positionLeft, positionTop) {
                var x = 0,
                    headerImagePositionsLength = imagePositions.length;

                for (; x < headerImagePositionsLength; x++) {
                    if (imagePositions[x].pointOverlaps(positionLeft, positionTop)) {
                        return true;
                    }
                }

                return false;
            },
            attachGridItemToNearestHeader: function (itemId, left, top) {
                var headerImageLength = imagePositions.length,
                    imageCounter = 0,
                    currentDistanceToHeader,
                    smallImageCenterPoint = new TEGUD.Utilities.CartesianPoint(left + (75 / 2), top + (75 / 2)),
                    nearestHeaderIndex = -1,
                    distanceToNearestHeader = -1;

                for (; imageCounter < headerImageLength; imageCounter++) {
                    currentDistanceToHeader = imagePositions[imageCounter].distanceTo(smallImageCenterPoint);

                    if (distanceToNearestHeader < 0 || currentDistanceToHeader < distanceToNearestHeader) {
                        distanceToNearestHeader = currentDistanceToHeader;
                        nearestHeaderIndex = imageCounter;

                        continue;
                    }

                    if (distanceToNearestHeader == currentDistanceToHeader) {
                        // TOOD: Randomise choice between this and previous choice.
                    }
                }

                imagePositions[nearestHeaderIndex].closestGridImages[imagePositions[nearestHeaderIndex].closestGridImages.length] = {
                    id: itemId,
                    distance: distanceToNearestHeader
                };

                return {
                    nearestHeaderIndex: nearestHeaderIndex,
                    distanceToNearestHeader: distanceToNearestHeader
                };
            },
            render: function () {
                return '<div class="photo-grid-headers">'
                    + $.map(imagePositions, function (item) { return item.render(); }).join('')
                    + '</div>';
            }
        };
    };
});
