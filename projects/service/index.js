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
    "{{projectname}}/server/init/initDatabase",
    "{{projectname}}/server/init/startServer"
], function(module, Channel, fs, Logger, loader, misc, utils, initDatabase, startServer) {
    "use strict";
    var logger = new Logger(module.id);
    utils.checkRootModuleName(module, "{{projectname}}");

    return {
        main: function() {
            // load config file
            var conf = loader.loadAppConfig(module);

            // create neccessary dirs
            fs.mkdirIfNotExists(conf.appdir + "log");
            fs.mkdirIfNotExists(conf.appdir + "work");

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
