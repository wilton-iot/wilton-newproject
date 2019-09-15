/*
{{license}}
 */

define([
    // use PGConnection instead for Postgres
    "wilton/DBConnection",
    "./conf"
], function(DBConnection, conf) {
    "use strict";

    // create and return "thread-local" connection
    return new DBConnection(conf.database.url);

});
