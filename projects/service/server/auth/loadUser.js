/*
{{license}}
 */

define([
    "module",
    "wilton/Logger",
    "../conf",
    "../db",
    "../models/auth"
], function(module, Logger, conf, db, auth) {
    "use strict";
    var logger = new Logger(module.id);

    return function(login) {
        logger.debug("Loading auth user, login: [" + login + "] ...");
        var res = db.doInSyncTransaction(conf.database.url, function() {
            return auth.loadByLogin(login);
        });
        if (null === res) {
            logger.warn("Auth user not found, login: [" + login + "]");
        } else {
            logger.debug("Auth user loaded, id: [" + res.id + "]");
        }
        return res;
    };
});