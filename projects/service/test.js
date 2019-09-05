/*
{{license}}
 */

define([
    "module",
    "wilton/Channel",
    "wilton/Logger",
    "wilton/loader",
    "{{projectname}}/server/startup/createDirs",
    "{{projectname}}/server/startup/initDatabase"
], function(module, Channel, Logger, loader, createDirs, initDatabase) {
    "use strict";
    var logger = new Logger(module.id);

    Logger.initialize({
        appenders: [{
            appenderType: "CONSOLE",
            thresholdLevel: "INFO"
        }],
        loggers: {
            "staticlib": "WARN",
            "wilton": "WARN",
            "{{projectname}}": "WARN",
            "{{projectname}}.test": "DEBUG"
        }
    });

    return {
        main: function() {
            var conf = loader.loadAppConfig(module);
            new Channel("{{projectname}}/server/conf", 1).send(conf);
            createDirs(conf);
            initDatabase(conf);

            require([
                // server
                "{{projectname}}/test/startup/startServerTest",

                // models
                "{{projectname}}/test/models/userTest",

                // views
                "{{projectname}}/test/views/pingTest",
                "{{projectname}}/test/views/usersTest"
            ], function(server) {
                server.stop();
            });
            
            logger.info("TESTS PASSED");
        }
    };

});

