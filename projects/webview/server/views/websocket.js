/*
{{license}}
 */

define([
    "module",
    "lodash/includes",
    "lodash/isObject",
    "lodash/isString",
    "lodash/startsWith",
    "wilton/Logger",
    "wilton/backendcall"
], function(module, includes, isObject, isString, startsWith, Logger, backendcall) {
    "use strict";
    var logger = new Logger(module.id);

    return {
        WSOPEN: function(req) {
            logger.info("WebSocket connection established, id: [" + req.getWebSocketId() + "]");
        },

        WSMESSAGE: function(req) {
            logger.info("WebSocket message received, data: [" + req.data() + "]");
            try {
                var msg = req.json();
                if (!(isObject(msg) && 
                        isObject(msg.payload) &&
                        isString(msg.payload.module) &&
                        startsWith(msg.payload.module, "{{projectname}}/server/calls") &&
                        !includes(msg.payload.module, ".."))) {
                    throw new Error("Invalid message");
                }
                var resp = backendcall(req.data());
                req.sendWebSocket(resp);
            } catch(e) {
                logger.warn("Invalid WebSocket message, data: [" + req.data() + "]");
            }
        },

        WSCLOSE: function(req) {
            logger.info("WebSocket connection closed, id: [" + req.getWebSocketId() + "]");
        }
    };
});
