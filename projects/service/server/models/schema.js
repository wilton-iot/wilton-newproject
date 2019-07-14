/*
{{license}}
 */

define([
    "module",
    "wilton/loader",
    "wilton/Logger",
    "../db"
], function(module, loader, Logger, db) {
    "use strict";
    var logger = new Logger(module.id);
    
    return {
        create: function() {
            var sqlPath = loader.findModulePath(module.id + ".sql");
            logger.info("Creating DB schema ...");
            var count = db.executeFile(sqlPath);
            logger.info("DB schema created, statements executed: [" + count + "]");
            return count;
        }
    };
});
