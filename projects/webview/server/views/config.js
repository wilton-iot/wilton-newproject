/*
{{license}}
 */

define([
    "module",
    "wilton/Logger",
    "../conf"
], function(module, Logger, conf) {
    "use strict";
    var logger = new Logger(module.id);

    return {
        GET: function(req) {
            req.sendResponse(conf.web);
        }
    };
});
