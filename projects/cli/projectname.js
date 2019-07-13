/*
{{license}}
 */

define([
    "module",
    "wilton/Logger"
], function(module, Logger) {
    "use strict";
    var logger = new Logger(module.id);

    // actual application logic
    return function(args) {

        if (args.printMe.length > 0) {
            logger.info(args.printMe);
        } else {
            print("No input data, specify something with '-p' switch!");
        }

    };
});