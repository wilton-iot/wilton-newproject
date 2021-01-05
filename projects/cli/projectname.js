/*
{{license}}
 */

"use strict";

define([
    "module",
    "wilton/Logger"
], (module, Logger) => {
    const logger = new Logger(module.id);

    // actual application logic
    return (args) => {
        if (args.printMe.length > 0) {
            logger.info(args.printMe);
        } else {
            print("No input data, specify something with '-p' switch!");
        }

    };
});