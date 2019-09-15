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
    "../models/note"
], function(module, isBoolean, isEmpty, isString, Logger, conf, db, note) {
    "use strict";
    var logger = new Logger(module.id);

    return {
        GET: function(req) {
            logger.debug("Notes list requested for input: [" + JSON.stringify(req.queries()) + "] ...");
            var errors = {};
            if (!isString(req.queries().title)/* || isEmpty(req.queries().title)*/) {
                errors.title = "Specified 'title' value is invalid";
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
                    return note.findByTitle(req.queries().title);
                });
                logger.debug("Users list loaded, count: [" + res.length + "]");
                req.sendResponse({
                    notes: res
                });
            }
        },

        POST: function(req) {
            logger.debug("Adding note: [" + req.data() + "] ...");
            var errors = {};
            var form = req.json();
            if (!isString(form.title) || isEmpty(form.title)) {
                errors.title = "Specified 'title' is empty";
            }
            if (!isString(form.contents) || isEmpty(form.contents)) {
                errors.contents = "Specified 'contents' is empty";
            }
            if (!isBoolean(form.important)) {
                errors.important = "Specified 'important' is empty";
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
                    return note.save(req.json());
                });
                logger.debug("Note added, id: [" + id + "]");
                req.sendResponse({
                    id: id
                });
            }

        }
    };
});