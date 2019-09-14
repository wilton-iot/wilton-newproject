/*
{{license}}
 */

define([
    "module",
    "wilton/Channel",
    "wilton/Logger"
], function(module, Channel, Logger) {
    "use strict";
    var logger = new Logger(module.id);

    return function(conf) {
        var dbres = null;
        // db modules depend on conf channel
        require([
            "{{projectname}}/server/db",
            "{{projectname}}/server/models/schema",
            "{{projectname}}/server/models/user",
            "{{projectname}}/server/models/auth"
        ], function(db, schema, user, auth) {
            // prepare lock for sqlite access
            new Channel(conf.database.url, 1);

            if (conf.database.reCreateOnStartup) {
                schema.create();

                db.doInSyncTransaction(conf.database.url, function() {
                    user.insertDummyRecords();
                    auth.insertDummyRecords();
                });
            }

            dbres = db;
        });
        return dbres;
    };

});