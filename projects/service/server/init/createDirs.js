/*
{{license}}
 */

define([
    "module",
    "wilton/Channel",
    "wilton/fs",
    "wilton/Logger"
], function(module, Channel, fs, Logger) {
    "use strict";
    var logger = new Logger(module.id);

    function createIfNotExists(dir) {
        if (!fs.exists(dir)) {
            fs.mkdir(dir);
        }
    }

    return function() {
        var conf = Channel.lookup("{{projectname}}/server/conf").peek();
        createIfNotExists(conf.appdir + "log");
        createIfNotExists(conf.appdir + "work");
    };
});
