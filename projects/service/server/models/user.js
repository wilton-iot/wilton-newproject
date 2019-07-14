/*
{{license}}
 */

define([
    // modules
    "module",
    "lodash/bind",
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
        module, bind, map, moment, // modules
        DBConnection, loader, Logger, // wilton
        conf, db // local
) {
    "use strict";
    var logger = new Logger(module.id);

    var queriesPath = loader.findModulePath(module.id + ".sql");
    var qrs = DBConnection.loadQueryFile(queriesPath);

    return {
        save: function(user) {
            db.execute(qrs.idUpdate);
            user.id = db.queryObject(qrs.idSelect).id;
            user.spam = user.spam ? 1 : 0;
            user.dateAdded = moment().format();
            db.execute(qrs.insert, user);
            return user.id;
        },

        loadById: function(id) {
            var user = db.queryObject(qrs.selectById, {
                id: id
            });
            user.spam = 1 === user.spam;
            return user;
        },

        find: function(params) {
            var list = db.queryList(qrs.select, params);
            return map(list, bind(function(rec) {
                // no real booleans in sqlite
                rec.spam = 1 === rec.spam;
                return rec;
            }, this));
        },

        count: function(params) {
            var rec = db.queryObject(qrs.count, params);
            return parseInt(rec.count, 10);
        },

        insertDummyRecords: function() {
            var count = 99;
            logger.info("Inserting dummy records, count: [" + (count - 10) + "]");
            for (var i = 10; i < count; i++) {
                db.execute(qrs.idUpdate);
                var user = {
                    id: db.queryObject(qrs.idSelect).id,
                    dateAdded: moment().add(i % 2 ? i : -i, "days").format(),
                    nick: "a" + i + "SomeNick",
                    email: "some" + (count - i) + "@email.com",
                    spam: 0 === i % 3 ? 0 : 1
                };
                db.execute(qrs.insert, user);
            }
        }
    };
});
