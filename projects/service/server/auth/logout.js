/*
{{license}}
 */

"use strict";

define([
    "module",
    "wilton/Logger",
    "./removeSession"
], (module, Logger, removeSession) => {
    const logger = new Logger(module.id);

    return {
        POST: (req) => {
            const success = removeSession(req.headers().Authorization);
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
