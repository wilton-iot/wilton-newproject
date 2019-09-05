/*
{{license}}
 */

define([
    "module",
    "wilton/kiosk",
    "wilton/Logger"
], function(module, kiosk, Logger) {
    "use strict";
    var logger = new Logger(module.id);

    return function(conf) {
        kiosk.run(conf.webview.kiosk);
    };

});
