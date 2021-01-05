/*
{{license}}
 */

"use strict";

define([
    "module",
    "wilton/loader",
    "wilton/Logger"
], (module, loader, Logger) => {
    const logger = new Logger(module.id);

    return {
        create(db) {
            const sqlPath = loader.findModulePath(module.id + ".sql");
            logger.info("Creating DB schema ...");
            const count = db.executeFile(sqlPath);
            logger.info("DB schema created, statements executed: [" + count + "]");
            return count;
        }
    };
});
