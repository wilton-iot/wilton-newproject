/*
{{license}}
 */

define([
    "module",
    "lodash/isString",
    "wilton/Logger",
    "../conf",
    "../db",
    "../models/user"
], function(module, isString, Logger, conf, db, user) {
    "use strict";
    var logger = new Logger(module.id);

    return {
        listByNick: function(nick) {
            var snick = isString(nick) ? nick : "";
            var res = db.doInSyncTransaction(conf.database.url, function() {
                return user.find({
                    nick: snick
                });
            });
            logger.debug("Users list loaded, count: [" + res.length + "]");
            return res;
        }
    };
});
