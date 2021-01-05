/*
{{license}}
 */

"use strict";

define([
    "module",
    "wilton/Logger",
    "../conf"
], (module, Logger, conf) => {
    const logger = new Logger(module.id);

    return {
        GET(req) {
            req.sendResponse({
                appname: conf.appname,
                message: "pong"
            });
        }
    };
});
