/*
{{license}}
 */

"use strict";

define([
    // deps
    "module",
    "moment",
    // wilton
    "wilton/DBConnection",
    "wilton/loader",
    "wilton/Logger",
    // local
    "../conf",
    "../db"
], (
        module, moment, // deps
        DBConnection, loader, Logger, // wilton
        conf, db // local
) => {
    const logger = new Logger(module.id);

    const queriesPath = loader.findModulePath(module.id + ".sql");
    const qrs = DBConnection.loadQueryFile(queriesPath);

    return {
        save(note) {
            db.execute(qrs.idUpdate);
            note.id = db.queryObject(qrs.idSelect).id;
            // no real booleans in sqlite
            note.important = note.important ? 1 : 0;
            note.dateAdded = moment().format();
            db.execute(qrs.insert, note);
            return note.id;
        },

        loadById(id) {
            const note = db.queryObject(qrs.selectById, {
                id: id
            });
            note.important = 1 === note.important;
            return note;
        },

        findByTitle(title) {
            const list = db.queryList(qrs.selectByTitle, {
                title: title
            });
            return list.map((rec) => {
                // no real booleans in sqlite
                rec.important = 1 === rec.spam;
                return rec;
            });
        },

        insertDummyRecords() {
            const count = 99;
            logger.info("Inserting dummy records, count: [" + (count - 10) + "]");
            for (let i = 10; i < count; i++) {
                db.execute(qrs.idUpdate);
                const note = {
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
