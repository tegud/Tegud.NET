define(['moment', 'forms/timeValidator'], function () {
    
    TEGUD.Forms.TimeSelector = (function () {
        return function (timeFieldContainer) {
            var timeValidator = new TEGUD.Forms.TimeValidator(timeFieldContainer),
                self = {
                    
                };
            
            return self;
        };
    })();

});