/*
{{license}}
 */

define([
    "module",
    "wilton/Channel",
    "wilton/Logger",
    "wilton/Server"
], function(module, Channel, Logger, Server) {
    "use strict";
    var logger = new Logger(module.id);

    return function(conf) {
        logger.info("Starting server on port: [" + conf.server.tcpPort + "]");
        var server = new Server({
            ipAddress: conf.server.ipAddress,
            tcpPort: conf.server.tcpPort,
            views: [
                "{{projectname}}/server/views/ping",
                "{{projectname}}/server/views/users"
            ],
            rootRedirectLocation: "/{{projectname}}/server/views/ping"
        });

        // share server instance to other threads
        // to be able to broadcast WebSocket messages
        new Channel("{{projectname}}/server/instance", 1).send({
            handle: server.handle
        });

        return server;
    };
});
