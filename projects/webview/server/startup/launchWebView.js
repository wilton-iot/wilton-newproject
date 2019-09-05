/*
{{license}}
 */

define([
    "module",
    "wilton/Logger"
], function(module, Logger) {
    "use strict";
    var logger = new Logger(module.id);

    return function(conf) {
        // kiosk requires X11 display
        // thus must be a lazy dep
        require(["wilton/kiosk"], function(kiosk) {
            kiosk.run(conf.webview.kiosk);
        });
    };

});
