/*
{{license}}
 */

define([
    // libs
    "module",
    // wilton
    "wilton/Channel",
    "wilton/fs",
    "wilton/Logger",
    "wilton/loader",
    "wilton/misc",
    "wilton/utils",
    // init
    "{{projectname}}/server/init/createDirs",
    "{{projectname}}/server/init/initDatabase",
    "{{projectname}}/server/init/startServer"
], function(
        module, // libs
        Channel, fs, Logger, loader, misc, utils, // wilton
        createDirs, initDatabase, startServer // init
) {
    "use strict";
    var logger = new Logger(module.id);
    utils.checkRootModuleName(module, "{{projectname}}");

    return {
        main: function() {
            // load config file
            var conf = loader.loadAppConfig(module);

            // create neccessary dirs
            createDirs();

            // init logging
            Logger.initialize(conf.logging);

            // share conf for other threads
            new Channel("{{projectname}}/server/conf", 1).send(conf);

            // db
            initDatabase().close();

            // server
            var server = startServer();

            misc.waitForSignal();
            logger.info("Shutting down ...");
            server.stop();
        }
    };

});
