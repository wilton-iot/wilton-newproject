/*
{{license}}
 */

define([
    //deps
    "module",
    "assert",
    // lodash
    "lodash/isObject",
    // wilton
    "wilton/httpClient",
    "wilton/Logger",
    // local
    "{{projectname}}/server/conf"
], function(
        module, assert, // deps
        isObject, // lodash
        http, Logger, // wilton
        conf // local
) {
    "use strict";
    var logger = new Logger(module.id);

    logger.info(module.id);

    var url = "http://127.0.0.1:" + conf.server.tcpPort + "/{{projectname}}/server/views/ping";

    var resp = http.sendRequest(url);
    assert.equal(resp.responseCode, 200);
    assert(isObject(resp.json()));
});
