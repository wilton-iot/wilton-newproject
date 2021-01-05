/*
{{license}}
 */

"use strict";

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
], (
        module, createPasswordHash, // modules
        DBConnection, loader, Logger, // wilton
        conf, db // local
) => {
    const logger = new Logger(module.id);

    const queriesPath = loader.findModulePath(module.id + ".sql");
    const qrs = DBConnection.loadQueryFile(queriesPath);

    return {
        save(user) {
            db.execute(qrs.idUpdate);
            user.id = db.queryObject(qrs.idSelect).id;
            db.execute(qrs.insert, user);
            return user.id;
        },

        loadByLogin(login) {
            return db.queryObject(qrs.selectByLogin, {
                login: login
            });
        },

        insertDummyRecords() {
            this.save({
                login: "admin",
                role: "superuser",
                pwdHash: createPasswordHash("password", "admin")
            });
        }
    };
});
