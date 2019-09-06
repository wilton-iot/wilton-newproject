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
    // local
    "./initDatabase",
    "./startServer",
    "text!./systemd.service"
], function(
        module,
        fs, Logger, misc, mustache, // wilton
        initDatabase, startServer, sst // local
) {
    "use strict";
    var logger = new Logger(module.id);

    return {
        createServiceFile: function(conf) {
            var path = conf.appdir + "work/{{projectname}}.service";
            var username = misc.wiltonConfig().environmentVariables.USER;
            if (!("string" === typeof(username) && username.length > 0)) {
                print("ERROR: cannot find out user name from '$USER' environment variable");
                return 1;
            }
            var text = mustache.render(sst, {
                appdir: conf.appdir,
                username: username
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
            misc.systemdNotify("READY=1");

            // wait for signal from systemd
            misc.waitForSignal();

            // shutdown
            logger.info("Shutting down ...");
            server.stop();
        }
    };

});
