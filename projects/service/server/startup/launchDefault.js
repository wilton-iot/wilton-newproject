/*
{{license}}
 */

"use strict";

define([
    "module",
    // wilton
    "wilton/Logger",
    "wilton/misc",
    "wilton/process",
    // local
    "./initAuth",
    "./startServer"
], (
        module,
        Logger, misc, process, // wilton
        initAuth, startServer // local
) => {
    const logger = new Logger(module.id);

    return (conf) => {
        // init logging
        Logger.initialize(conf.logging);

        // auth
        initAuth(conf);

        // server
        const server = startServer(conf);

        // wait for signal from systemd
        logger.info("Awaiting shutdown signal (Ctrl+C), pid: [" + process.currentPid() + "] ...");
        misc.waitForSignal();

        // shutdown
        logger.info("Shutting down ...");
        server.stop();
    };

});
