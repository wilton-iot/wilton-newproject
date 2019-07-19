/*
{{license}}
 */

define([
    "module",
    "wilton/kiosk",
    "wilton/loader"
], function(module, kiosk, loader) {
    "use strict";

    return {
        main: function() {
            var conf = loader.loadAppConfig(module);
            kiosk.run(conf.webview.kiosk);
        }
    };
});
