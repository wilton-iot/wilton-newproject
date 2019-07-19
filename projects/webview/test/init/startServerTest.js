/*
{{license}}
 */

define([
    //deps
    "module",
    "assert",
    // wilton
    "wilton/httpClient",
    "wilton/Logger",
    // local
    "{{projectname}}/server/conf",
    "{{projectname}}/server/init/startServer"
], function(
        module, assert, // deps
        http, Logger, // wilton
        conf, startServer // local
) {
    "use strict";
    var logger = new Logger(module.id);

    logger.info(module.id);
    // start
    var server = null;
    try {
        var server = startServer();
        assert(server);
        // ping
        var resp = http.sendRequest("http://127.0.0.1:" + conf.server.tcpPort + "/{{projectname}}/server/views/ping");
        assert.equal(resp.responseCode, 200);
    } finally {
        if (null !== server) {
            server.stop();
        }
    }
});
