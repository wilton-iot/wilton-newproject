/*
{{license}}
 */

define([
    "module",
    "wilton/fs",
    "wilton/Logger"
], function(module, fs, Logger) {
    "use strict";
    var logger = new Logger(module.id);

    function createIfNotExists(dir) {
        if (!fs.exists(dir)) {
            fs.mkdir(dir);
        }
    }

    return function(conf) {
        createIfNotExists(conf.appdir + "log");
        createIfNotExists(conf.appdir + "work");
    };
});

