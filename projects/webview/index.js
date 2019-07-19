/*
{{license}}
 */

define([
    // libs
    "module",
    // wilton
    "wilton/Channel",
    "wilton/Logger",
    "wilton/loader",
    "wilton/misc",
    "wilton/process",
    "wilton/utils",
    // init
    "{{projectname}}/server/init/createDirs",
    "{{projectname}}/server/init/initDatabase",
    "{{projectname}}/server/init/startServer"
], function(
        module, // libs
        Channel, Logger, loader, misc, process, utils, // wilton
        createDirs, initDatabase, startServer // init
) {
    "use strict";
    var logger = new Logger(module.id);
    utils.checkRootModuleName(module, "{{projectname}}");

    return {
        main: function() {
            // load config file
            var conf = loader.loadAppConfig(module);
            // share conf for other threads
            new Channel("{{projectname}}/server/conf", 1).send(conf);

            // create neccessary dirs
            createDirs();

            // init logging
            Logger.initialize(conf.logging);

            // db
            initDatabase().close();

            // server
            var server = startServer();

            // share server instance to other threads
            // to be able to broadcast WebSocket messages
            new Channel("{{projectname}}/server/instance", 1).send({
                handle: server.handle
            });

            if ((misc.isLinux() || misc.isWindows()) && conf.webview.enabled) {
                logger.info("Initializing WebView ...");
                process.spawn({
                    executable: misc.wiltonConfig().wiltonExecutable,
                    args: [conf.appdir + "webview.js", "-j", "duktape"],
                    outputFile: conf.appdir + "work/client_out.txt",
                    awaitExit: true
                });
            } else {
                logger.info("Awaiting shutdown signal ...");
                misc.waitForSignal();
            }
            logger.info("Shutting down ...");
            server.stop();
        }
    };

});
