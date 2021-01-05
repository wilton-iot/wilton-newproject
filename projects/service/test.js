/*
{{license}}
 */

"use strict";

define([
    // libs
    "module",
    "wilton/Channel",
    "wilton/Logger",
    "wilton/loader",
    // local
    "{{projectname}}/server/startup/createDb",
    "{{projectname}}/server/startup/createDirs",
    "{{projectname}}/server/startup/initAuth"
], (
        module, Channel, Logger, loader, // libs
        createDb, createDirs, initAuth // local
) => {
    const logger = new Logger(module.id);

    Logger.initialize({
        appenders: [{
            appenderType: "CONSOLE",
            thresholdLevel: "DEBUG"
        }],
        loggers: {
            "staticlib": "WARN",
            "wilton": "WARN",
            "{{projectname}}": "WARN",
            "{{projectname}}.server.auth": "ERROR",
            "{{projectname}}.test": "DEBUG"
        }
    });

    return () => {
        const conf = loader.loadAppConfig(module);
        new Channel("{{projectname}}/server/conf", 1).send(conf);
        createDirs(conf);
        // prepare lock for sqlite access
        new Channel(conf.database.url, 1);
        createDb(conf);
        initAuth(conf);

        require([
            // server
            "{{projectname}}/test/startup/startServerTest",

            // auth
            "{{projectname}}/test/auth/authTest",

            // models
            "{{projectname}}/test/models/noteTest",

            // views
            "{{projectname}}/test/views/pingTest",
            "{{projectname}}/test/views/notesTest"
        ], (server) => {
            server.stop();
        });
        
        logger.info("TESTS PASSED");
    };

});

