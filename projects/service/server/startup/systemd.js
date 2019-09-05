/*
{{license}}
 */

define([
    "module",
    // wilton
    "wilton/fs",
    "wilton/Logger",
    "wilton/misc",
    "wilton/mustache",
    "wilton/process",
    // local
    "./initDatabase",
    "./startServer",
    "text!./systemd.service"
], function(
        module,
        fs, Logger, misc, mustache, process, // wilton
        initDatabase, startServer, sst // local
) {
    "use strict";
    var logger = new Logger(module.id);

    return {
        createServiceFile: function(conf) {
            var path = conf.appdir + "work/{{projectname}}.service";
            var text = mustache.render(sst, {
                appdir: conf.appdir
            });
            fs.writeFile(path, text);
            print("Service file written, path [" + path + "]");
            print("Copy it to '/etc/systemd/system/' directory and run:");
            print("> sudo systemctl enable {{projectname}}");
            print("> sudo systemctl start {{projectname}}");
            print("> sudo systemctl status {{projectname}}");
        },

        launch: function(conf) {
            // init logging
            Logger.initialize(conf.logging);

            // db
            initDatabase(conf).close();

            // server
            var server = startServer(conf);

            // notify systemd
            var code = process.spawn({
                executable: conf.systemd.notifyExecPath,
                args: ["--ready", "--pid", String(process.currentPid())],
                outputFile: conf.appdir + "work/sd_notify_out.txt",
                awaitExit: true
            });
            if (0 !== code) {
                logger.error("Error notifying systemd, code: [" + code + "], shutting down ...");
                server.stop();
                return 1;
            }

            // wait for signal from systemd
            misc.waitForSignal();

            // shutdown
            logger.info("Shutting down ...");
            server.stop();
        }
    };

});
