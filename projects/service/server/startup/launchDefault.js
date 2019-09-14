/*
{{license}}
 */

define([
    "module",
    // wilton
    "wilton/Logger",
    "wilton/misc",
    "wilton/process",
    // local
    "./initAuth",
    "./initDatabase",
    "./startServer"
], function(
        module,
        Logger, misc, process, // wilton
        initAuth, initDatabase, startServer // local
) {
    "use strict";
    var logger = new Logger(module.id);

    return function(conf) {
        // init logging
        Logger.initialize(conf.logging);

        // db
        initDatabase(conf).close();

        // auth
        initAuth(conf);

        // server
        var server = startServer(conf);

        // wait for signal from systemd
        logger.info("Awaiting shutdown signal (Ctrl+C), pid: [" + process.currentPid() + "] ...");
        misc.waitForSignal();

        // shutdown
        logger.info("Shutting down ...");
        server.stop();
    };

});
