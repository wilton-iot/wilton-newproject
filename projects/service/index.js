/*
{{license}}
 */

define([
    // libs
    "module",
    "argparse",
    // wilton
    "wilton/Channel",
    "wilton/loader",
    "wilton/Logger",
    "wilton/utils",
    // startup
    "{{projectname}}/server/startup/createDirs",
    "{{projectname}}/server/startup/launchDefault",
    "{{projectname}}/server/startup/systemd"
], function(
        module, argparse, // libs
        Channel, loader, Logger, utils, // wilton
        createDirs, launchDefault, systemd // startup
) {
    "use strict";
    var logger = new Logger(module.id);
    utils.checkRootModuleName(module, "{{projectname}}");

    function createArgParser() {
        // parser
        var ap = new argparse.ArgumentParser({
            addHelp: false,
            nargs: argparse.Const.REMAINDER,
            prog: "{{projectname}}",
            description: "{{projectname}} application",
            usage: "wilton index.js -- [options]"
        });

        // https://github.com/wilton-iot/argparse#addargument-method

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

        // todo: winscm

        // other
        ap.addArgument(["-h", "--help"], {
            action: "storeTrue",
            dest: "help",
            defaultValue: false,
            help: "Prints this message"
        });

        return ap;
    }

    return {
        main: function() {
            // create arg parser
            var ap = createArgParser();

            // parse arguments
            var args = null;
            try {
                var arglist = Array.prototype.slice.call(arguments);
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

            // run aplication
            if (args.help) {
                ap.printHelp();
                return;
            } else if (args.createSystemdServiceFile) {
                return systemd.createServiceFile(conf);
            } else if (args.launchSystemdService) {
                return systemd.launch(conf);
            } else {
                return launchDefault(conf);
            }

        }
    };

});
