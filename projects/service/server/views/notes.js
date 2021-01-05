/*
{{license}}
 */

"use strict";

define([
    "module",
    "lodash/isBoolean",
    "lodash/isEmpty",
    "lodash/isString",
    "wilton/Logger",
    "../conf",
    "../db",
    "../models/note"
], (module, isBoolean, isEmpty, isString, Logger, conf, db, note) => {
    const logger = new Logger(module.id);

    return {
        GET(req) {
            logger.debug("Notes list requested for input: [" + JSON.stringify(req.queries()) + "] ...");
            const errors = {};
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
                const res = db.doInSyncTransaction(conf.database.url, () => {
                    return note.findByTitle(req.queries().title);
                });
                logger.debug("Users list loaded, count: [" + res.length + "]");
                req.sendResponse({
                    notes: res
                });
            }
        },

        POST(req) {
            logger.debug("Adding note: [" + req.data() + "] ...");
            const errors = {};
            const form = req.json();
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
                const id = db.doInSyncTransaction(conf.database.url, () => {
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