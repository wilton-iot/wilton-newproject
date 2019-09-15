/*
{{license}}
 */

define([
    "module",
    "wilton/Channel",
    "wilton/Logger",
    "wilton/loader",
    "{{projectname}}/server/startup/createDirs",
    "{{projectname}}/server/startup/initAuth",
    "{{projectname}}/server/startup/initDatabase"
], function(module, Channel, Logger, loader, createDirs, initAuth, initDatabase) {
    "use strict";
    var logger = new Logger(module.id);

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

    return {
        main: function() {
            var conf = loader.loadAppConfig(module);
            new Channel("{{projectname}}/server/conf", 1).send(conf);
            createDirs(conf);
            initDatabase(conf);
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
            ], function(server) {
                server.stop();
            });
            
            logger.info("TESTS PASSED");
        }
    };

});

