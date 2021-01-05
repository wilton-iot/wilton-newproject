/*
{{license}}
 */

"use strict";

define([
    "module",
    "argparse",
    "wilton/Logger",
    "./{{projectname}}"
], (module, argparse, Logger, {{projectname}}) => {
    const logger = new Logger(module.id);

    return (...funargs) => {
        // init logging
        Logger.initConsole("INFO");

        // prepare arg parser
        const ap = new argparse.ArgumentParser({
            addHelp: false,
            nargs: argparse.Const.REMAINDER,
            prog: "cli",
            description: "Wilton command line application stub"
        });
        // https://github.com/wiltonruntime/argparse#addargument-method
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
        let args = null;
        try {
            const arglist = Array.prototype.slice.call(funargs);
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
    };
});
