/*
{{license}}
 */

"use strict";

define([
    //deps
    "module",
    "assert",
    // wilton
    "wilton/httpClient",
    "wilton/Logger",
    // local
    "{{projectname}}/server/conf",
    "{{projectname}}/server/startup/startServer"
], (
        module, assert, // deps
        http, Logger, // wilton
        conf, startServer // local
) => {
    const logger = new Logger(module.id);

    logger.info(module.id);
    // start
    const server = startServer(conf);
    assert(server);
    // ping
    const resp = http.sendRequest("http://127.0.0.1:" + conf.server.tcpPort + "/{{projectname}}/server/views/ping");
    assert.equal(resp.responseCode, 200);
    return server;
});
