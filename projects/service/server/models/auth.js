/*
{{license}}
 */

define([
    // modules
    "module",
    "pwdauth/createPasswordHash",
    // wilton
    "wilton/DBConnection",
    "wilton/loader",
    "wilton/Logger",
    // local
    "../conf",
    "../db"
], function(
        module, createPasswordHash, // modules
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
            db.execute(qrs.insert, user);
            return user.id;
        },

        loadByLogin: function(login) {
            return db.queryObject(qrs.selectByLogin, {
                login: login
            });
        },

        insertDummyRecords: function() {
            this.save({
                login: "admin",
                role: "superuser",
                pwdHash: createPasswordHash("password", "admin")
            });
        }
    };
});
