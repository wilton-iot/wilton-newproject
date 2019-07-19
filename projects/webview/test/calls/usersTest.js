/*
{{license}}
 */

define([
    //deps
    "module",
    "assert",
    "lodash/isArray",
    "lodash/isBoolean",
    "lodash/isString",
    "moment",
    // wilton
    "wilton/Logger",
    // local
    "{{projectname}}/server/conf",
    "{{projectname}}/server/calls/users"
], function(
        module, assert, isArray, isBoolean, isString, moment, // deps
        Logger, // wilton
        conf, users // local
) {
    "use strict";
    var logger = new Logger(module.id);
    logger.info(module.id);

    // list
    var loaded = users.listByNick("a1");
    assert(isArray(loaded));
    assert(loaded.length > 0);
    assert(loaded[0].id > 0);
    assert(isString(loaded[0].nick));
    assert(isString(loaded[0].email));
    assert(isBoolean(loaded[0].spam));
    assert(moment(loaded[0].dateAdded).isValid());

    // all
    var all = users.listByNick("");
    assert(isArray(all));
    assert(all.length > loaded.length);

    // empty
    var empty = users.listByNick("fail");
    assert(isArray(empty));
    assert.equal(empty.length, 0);
});
