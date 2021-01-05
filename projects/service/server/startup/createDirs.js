/*
{{license}}
 */

"use strict";

define([
    "module",
    "wilton/fs",
    "wilton/Logger"
], (module, fs, Logger) => {
    const logger = new Logger(module.id);

    function createIfNotExists(dir) {
        if (!fs.exists(dir)) {
            fs.mkdir(dir);
        }
    }

    return (conf) => {
        createIfNotExists(conf.appdir + "log");
        createIfNotExists(conf.appdir + "work");
    };
});

