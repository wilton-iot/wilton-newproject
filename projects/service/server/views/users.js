/*
{{license}}
 */

define([
    "module",
    "lodash/isBoolean",
    "lodash/isEmpty",
    "lodash/isString",
    "wilton/Logger",
    "../conf",
    "../db",
    "../models/user"
], function(module, isBoolean, isEmpty, isString, Logger, conf, db, user) {
    "use strict";
    var logger = new Logger(module.id);

    return {
        GET: function(req) {
            logger.debug("Users list requested for input: [" + JSON.stringify(req.queries()) + "] ...");
            var errors = {};
            var form = req.queries();
            if (!isString(form.nick)/* || isEmpty(form.nick)*/) {
                errors.nick = "Requsted 'nick' is invalid";
            }
            if (!isEmpty(errors)) {
                req.sendResponse({
                    errors: errors
                }, {
                    meta: {
                        statusCode: 400,
                        statusMessage: "Bad Request"
                    }
                });
            } else {
                var res = db.doInSyncTransaction(conf.database.url, function() {
                    return user.find(req.queries().nick);
                });
                logger.debug("Users list loaded, count: [" + res.length + "]");
                req.sendResponse({
                    users: res
                });
            }
        },

        POST: function(req) {
            logger.debug("Adding user: [" + req.data() + "] ...");
            var errors = {};
            var form = req.json();
            if (!isString(form.nick) || isEmpty(form.nick)) {
                errors.nick = "Specified 'nick' is empty";
            }
            if (!isString(form.email) || isEmpty(form.email)) {
                errors.email = "Specified 'email' is empty";
            }
            if (!isBoolean(form.spam)) {
                errors.spam = "Specified 'spam' is empty";
            }
            if (!isEmpty(errors)) {
                req.sendResponse({
                    errors: errors
                }, {
                    meta: {
                        statusCode: 400,
                        statusMessage: "Bad Request"
                    }
                });
            } else {
                var id = db.doInSyncTransaction(conf.database.url, function() {
                    return user.save(req.json());
                });
                logger.debug("User added, id: [" + id + "]");
                req.sendResponse({
                    id: id
                });
            }

        }
    };
});