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

    return function() {
        var conf = Channel.lookup("{{projectname}}/server/conf").peek();
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

        return server;
    };
});
