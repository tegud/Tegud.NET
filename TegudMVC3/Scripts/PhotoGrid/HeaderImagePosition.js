define(['tegud/base', 'utilities/base'], function () {
    TEGUD.PhotoGridHeaderImagePosition = function (width, height, top, left, src, name, index, smallImages) {
        var centerPoint = new TEGUD.Utilities.CartesianPoint(left + (width / 2), top + (height / 2)),
            id = 'header-image-' + index;

        return {
            id: id,
            top: top,
            left: left,
            width: width,
            height: height,
            closestGridImages: [],
            smallImages: smallImages,
            distanceTo: function (otherPoint) {
                return centerPoint.distanceTo(otherPoint);
            },
            pointOverlaps: function (otherLeft, otherTop) {
                return otherLeft >= left && otherLeft <= left + width
                    && otherTop >= top && otherTop <= top + height;
            },
            render: function () {
                return '<div data-group-name="' + name + '" data-group-index="' + index + '" id="' + id + '" class="grid-image header-image" style="width: '
                    + this.width + 'px;height: '
                    + this.height + 'px; top: '
                    + this.top + 'px; left: '
                    + this.left
                    + 'px"><img src="' + src + '"/><h2>'
                    + name
                    + '</h2></div>';
            }
        };
    };
});
