/*
{{license}}
 */

"use strict";

define([
    // libs
    "module",
    "argparse",
    // wilton
    "wilton/Channel",
    "wilton/loader",
    "wilton/misc",
    "wilton/Logger",
    "wilton/utils",
    // startup
    "{{projectname}}/server/startup/createDb",
    "{{projectname}}/server/startup/createDirs",
    "{{projectname}}/server/startup/launchDefault",
    "{{projectname}}/server/startup/systemd"
], (
        module, argparse, // libs
        Channel, loader, { stdinReadline }, Logger, utils, // wilton
        createDb, createDirs, launchDefault, systemd // startup
) => {
    const logger = new Logger(module.id);
    utils.checkRootModuleName(module, "{{projectname}}");

    function createArgParser() {
        // parser
        const ap = new argparse.ArgumentParser({
            addHelp: false,
            nargs: argparse.Const.REMAINDER,
            prog: "{{projectname}}",
            description: "{{projectname}} application",
            usage: "wilton index.js -- [options]"
        });

        // https://github.com/wiltonruntime/argparse#addargument-method

        // systemd
        ap.addArgument(["--create-systemd-unit-file"], {
            action: "storeTrue",
            dest: "createSystemdServiceFile",
            defaultValue: false,
            help: "Creates a systemd unit file '{{projectname}}.service'" +
                    " that allows to run this application as a systemd service"
        });
        ap.addArgument(["--launch-systemd-service"], {
            action: "storeTrue",
            dest: "launchSystemdService",
            defaultValue: false,
            help: "Launch this application as a systemd service (entry point for systemd)"
        });
        ap.addArgument(["--re-create-database"], {
            action: "storeTrue",
            dest: "reCreateDatabase",
            defaultValue: false,
            help: "Re-creates database schema, all existing data will be lost"
        });

        // other
        ap.addArgument(["-h", "--help"], {
            action: "storeTrue",
            dest: "help",
            defaultValue: false,
            help: "Prints this message"
        });

        return ap;
    }

    return (...funargs) => {
        // create arg parser
        var ap = createArgParser();

        // parse arguments
        var args = null;
        try {
            var arglist = Array.prototype.slice.call(funargs);
            args = ap.parseArgs(arglist);
        } catch (e) {
            // print details and exit on invalid args
            print(e.message);
            ap.printUsage();
            return 2;
        }

        // load configuration file and share it for other threads
        var conf = loader.loadAppConfig(module);
        new Channel("{{projectname}}/server/conf", 1).send(conf);
        // prepare neccessary directories
        createDirs(conf);
        // prepare lock for sqlite access
        new Channel(conf.database.url, 1);

        // run aplication
        if (args.help) {
            ap.printHelp();
            return;
        } else if (args.createSystemdServiceFile) {
            return systemd.createServiceFile(conf);
        } else if (args.launchSystemdService) {
            return systemd.launch(conf);
        } else if (args.reCreateDatabase) {
            print("WARNING! ALL EXISTING DB DATA WILL BE LOST!");
            print("Please type 'yes' to confirm the operation:");
            const resp = stdinReadline();
            if ("yes" === resp) {
                Logger.initConsole("INFO");
                print("Operation confirmed, procceeding ...");
                createDb(conf);
                print("Operation completed");
            } else {
                print("Operation canceled");
            }
        } else {
            return launchDefault(conf);
        }
    };

});
