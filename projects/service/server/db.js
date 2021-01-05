/*
{{license}}
 */

"use strict";

define([
    // use PGConnection instead for Postgres
    "wilton/DBConnection",
    "./conf"
], (DBConnection, conf) => {

    // create and return "thread-local" connection
    return new DBConnection(conf.database.url);

});
