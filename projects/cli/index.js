/*
{{license}}
 */

define([
    "module",
    "argparse",
    "wilton/Logger",
    "./{{projectname}}"
], function(module, argparse, Logger, {{projectname}}) {
    "use strict";
    var logger = new Logger(module.id);

    return {
        main: function() {
            // init logging
            Logger.initConsole("INFO");

            // prepare arg parser
            var ap = new argparse.ArgumentParser({
                addHelp: false,
                nargs: argparse.Const.REMAINDER,
                prog: "cli",
                description: "Wilton command line application stub"
            });
            // https://github.com/wilton-iot/argparse#addargument-method
            ap.addArgument(["-p", "--print-me"], {
                action: "store",
                type: "string",
                dest: "printMe",
                defaultValue: "",
                help: "Prints specified message to log output"
            });
            ap.addArgument(["-h", "--help"], {
                action: "storeTrue",
                dest: "help",
                defaultValue: false,
                help: "Prints this message"
            });
            ap.addArgument([], {
                action: "store",
                dest: "other",
                defaultValue: [],
                nargs: argparse.Const.REMAINDER
            });

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

            // show help
            if (args.help) {
                ap.printHelp();
                return;
            }

            // proceed with program logic calling app.js
            {{projectname}}(args);
        }
    };
});
