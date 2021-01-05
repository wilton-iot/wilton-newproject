/*
{{license}}
 */

"use strict";

define([
    "module",
    "wilton/Logger",
    "../conf",
    "../db",
    "../models/auth"
], (module, Logger, conf, db, auth) => {
    const logger = new Logger(module.id);

    return (login) => {
        logger.debug("Loading auth user, login: [" + login + "] ...");
        const res = db.doInSyncTransaction(conf.database.url, () => {
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