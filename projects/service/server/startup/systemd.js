/*
{{license}}
 */

"use strict";

define([
    "module",
    // wilton
    "wilton/fs",
    "wilton/Logger",
    "wilton/misc",
    "wilton/mustache",
    // local
    "./initAuth",
    "./startServer",
    "text!./systemd.service"
], (
        module,
        fs, Logger, misc, mustache, // wilton
        initAuth, startServer, sst // local
) => {
    const logger = new Logger(module.id);

    return {
        createServiceFile(conf) {
            const path = conf.appdir + "work/{{projectname}}.service";
            const username = misc.wiltonConfig().environmentVariables.USER;
            if (!("string" === typeof(username) && username.length > 0)) {
                print("ERROR: cannot find out user name from '$USER' environment variable");
                return 1;
            }
            const text = mustache.render(sst, {
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

        launch(conf) {
            // init logging
            Logger.initialize(conf.logging);

            // auth
            initAuth(conf);

            // server
            const server = startServer(conf);

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
