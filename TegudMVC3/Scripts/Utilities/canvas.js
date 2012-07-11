define(['utilities/base'], function () {
    var setImageTextColour = function (image) {
        var $canvas = $('<canvas width="' + image.width() + '" height="' + image.height() + '"></canvas>').appendTo($('body')),
            canvas = $canvas[0],
            context = canvas.getContext('2d'),
            textContainer = image.siblings('h2'),
            textXStart = textContainer.position().left,
            textYStart = textContainer.position().top,
            imageData,
            pixels,
            pixelsLength,
            i = 0,
            r = 0, g = 0, b = 0;

        context.drawImage(image[0], 0, 0);

        imageData = context.getImageData(textXStart, textYStart, textContainer.width(), textContainer.height());
        pixels = imageData.data;
        pixelsLength = pixels.length;

        for (; i < pixelsLength; i += 4) {
            r += pixels[i];
            g += pixels[i + 1];
            b += pixels[i + 2];
        }

        textContainer.css('color', '#'
            + r / pixelsLength % 4
            + g / pixelsLength % 4
            + b / pixelsLength % 4);

        $canvas.remove();
    };

    return {
        setImageTextColour: setImageTextColour
    };
});