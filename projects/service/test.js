/*
{{license}}
 */

define([
    "module",
    "wilton/Channel",
    "wilton/fs",
    "wilton/Logger",
    "wilton/loader",
    "{{projectname}}/server/init/initDatabase"
], function(module, Channel, fs, Logger, loader, initDatabase) {
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
            fs.mkdirIfNotExists(conf.appdir + "log");
            fs.mkdirIfNotExists(conf.appdir + "work");
            new Channel("{{projectname}}/server/conf", 1).send(conf);
            initDatabase();

            require([
                // server
                "{{projectname}}/test/init/startServerTest",

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

