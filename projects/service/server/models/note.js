/*
{{license}}
 */

define([
    // deps
    "module",
    "lodash/map",
    "moment",
    // wilton
    "wilton/DBConnection",
    "wilton/loader",
    "wilton/Logger",
    // local
    "../conf",
    "../db"
], function(
        module, map, moment, // deps
        DBConnection, loader, Logger, // wilton
        conf, db // local
) {
    "use strict";
    var logger = new Logger(module.id);

    var queriesPath = loader.findModulePath(module.id + ".sql");
    var qrs = DBConnection.loadQueryFile(queriesPath);

    return {
        save: function(note) {
            db.execute(qrs.idUpdate);
            note.id = db.queryObject(qrs.idSelect).id;
            // no real booleans in sqlite
            note.important = note.important ? 1 : 0;
            note.dateAdded = moment().format();
            db.execute(qrs.insert, note);
            return note.id;
        },

        loadById: function(id) {
            var note = db.queryObject(qrs.selectById, {
                id: id
            });
            note.important = 1 === note.important;
            return note;
        },

        findByTitle: function(title) {
            var list = db.queryList(qrs.selectByTitle, {
                title: title
            });
            return map(list, function(rec) {
                // no real booleans in sqlite
                rec.important = 1 === rec.spam;
                return rec;
            });
        },

        insertDummyRecords: function() {
            var count = 99;
            logger.info("Inserting dummy records, count: [" + (count - 10) + "]");
            for (var i = 10; i < count; i++) {
                db.execute(qrs.idUpdate);
                var note = {
                    id: db.queryObject(qrs.idSelect).id,
                    dateAdded: moment().add(i % 2 ? i : -i, "days").format(),
                    title: "a" + i + "SomeTitle",
                    contents: "some" + (count - i) + "contents",
                    important: 0 === i % 3 ? 0 : 1
                };
                db.execute(qrs.insert, note);
            }
        }
    };
});
