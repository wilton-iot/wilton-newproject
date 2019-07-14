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

    return function() {
        var dbres = null;
        require([
            "{{projectname}}/server/conf",
            "{{projectname}}/server/db",
            "{{projectname}}/server/models/schema",
            "{{projectname}}/server/models/user"
        ], function(conf, db, schema, user) {
            // prepare lock for sqlite access
            new Channel(conf.database.url, 1);

            schema.create();

            db.doInSyncTransaction(conf.database.url, function() {
                user.insertDummyRecords();
            });

            dbres = db;
        });
        return dbres;
    };

});
