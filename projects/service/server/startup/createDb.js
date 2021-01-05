/*
{{license}}
 */

"use strict";

define([
    "module",
    "wilton/Channel",
    "wilton/Logger"
], (module, Channel, Logger) => {
    const logger = new Logger(module.id);

    return (conf) => {
        let dbres = null;
        // db modules depend on conf channel
        require([
            "{{projectname}}/server/db",
            "{{projectname}}/server/models/schema",
            "{{projectname}}/server/models/auth",
            "{{projectname}}/server/models/note"
        ], (db, schema, auth, note) => {

            schema.create(db);

            db.doInSyncTransaction(conf.database.url, function() {
                auth.insertDummyRecords();
                note.insertDummyRecords();
            });

            dbres = db;
        });
        return dbres;
    };

});