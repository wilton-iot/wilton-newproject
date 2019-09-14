/*
{{license}}
 */

define([
    "module",
    "wilton/Logger",
    "./removeSession"
], function(module, Logger, removeSession) {
    "use strict";
    var logger = new Logger(module.id);

    return {
        POST: function(req) {
            var success = removeSession(req.headers().Authorization);
            if (!success) {
                req.sendResponse("", {
                    meta: {
                        statusCode: 400,
                        statusMessage: "Bad Request"
                    }
                });
            }
        }
    };
});
