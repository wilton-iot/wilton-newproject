/*
{{license}}
 */

"use strict";

define([
    "module",
    "wilton/Channel",
    "wilton/Logger",
    "wilton/Server"
], (module, Channel, Logger, Server) => {
    const logger = new Logger(module.id);

    return (conf) => {
        logger.info("Starting server on port: [" + conf.server.tcpPort + "]");
        const server = new Server({
            ipAddress: conf.server.ipAddress,
            tcpPort: conf.server.tcpPort,
            views: [
                // auth
                "{{projectname}}/server/auth/login",
                "{{projectname}}/server/auth/logout",

                // app
                "{{projectname}}/server/views/ping",
                "{{projectname}}/server/views/notes"
            ],
            filters: [
                "{{projectname}}/server/auth/filter"
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
