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
    "{{projectname}}/server/startup/createGnomeDesktopFile",
    "{{projectname}}/server/startup/launchDefault",
    "{{projectname}}/server/startup/launchWebView",
    "{{projectname}}/server/startup/systemd"
], function(
        module, argparse, // libs
        Channel, loader, Logger, utils, // wilton
        createDirs, createGnomeDesktopFile, launchDefault, launchWebView, systemd // startup
) {
    "use strict";
    var logger = new Logger(module.id);
    utils.checkRootModuleName(module, "{{projectname}}");

    function createArgParser() {
        // parser
        var ap = new argparse.ArgumentParser({
            addHelp: false,
            nargs: argparse.Const.REMAINDER,
            prog: "test1",
            description: "test1 application",
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

        // gnome desktop
        ap.addArgument(["--create-gnome-desktop-file"], {
            action: "storeTrue",
            dest: "createGnomeDesktopFile",
            defaultValue: false,
            help: "Creates a Gnome desktop file '{{projectname}}.desktop'" +
                    " that allows to run the WebView for this application"
        });
        ap.addArgument(["--launch-webview"], {
            action: "storeTrue",
            dest: "launchWebView",
            defaultValue: false,
            help: "Launch WebView UI for this application"
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
            } else if (args.createGnomeDesktopFile) {
                return createGnomeDesktopFile(conf);
            } else if (args.launchWebView) {
                return launchWebView(conf);
            } else {
                return launchDefault(conf);
            }

        }
    };

});
