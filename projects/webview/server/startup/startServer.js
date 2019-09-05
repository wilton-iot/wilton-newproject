/*
{{license}}
 */

define([
    "module",
    "wilton/Channel",
    "wilton/loader",
    "wilton/Logger",
    "wilton/misc",
    "wilton/Server"
], function(module, Channel, loader, Logger, misc, Server) {
    "use strict";
    var logger = new Logger(module.id);

    return function(conf) {
        logger.info("Starting server on port: [" + conf.server.tcpPort + "]");
        var server = new Server({
            ipAddress: conf.server.ipAddress,
            tcpPort: conf.server.tcpPort,
            views: [
                "{{projectname}}/server/views/config",
                "{{projectname}}/server/views/ping",
                "{{projectname}}/server/views/websocket"
            ],
            rootRedirectLocation: "/web/index.html",
            documentRoots: [{
                resource: "/web",
                dirPath: loader.findModulePath("{{projectname}}/web"),
                cacheMaxAgeSeconds: conf.server.cacheMaxAgeSeconds
            },
            {
                resource: "/stdlib",
                zipPath: misc.wiltonConfig().wiltonHome + conf.server.stdlibFileName,
                cacheMaxAgeSeconds: conf.server.cacheMaxAgeSeconds
            }]
        });

        // share server instance to other threads
        // to be able to broadcast WebSocket messages
        new Channel("{{projectname}}/server/instance", 1).send({
            handle: server.handle
        });

        return server;
    };
});
