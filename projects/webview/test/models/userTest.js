/*
{{license}}
 */

define([
    //deps
    "module",
    "assert",
    "lodash/isArray",
    "lodash/isNumber",
    "lodash/isObject",
    "moment",
    // wilton
    "wilton/Logger",
    // local
    "{{projectname}}/server/conf",
    "{{projectname}}/server/models/user"
], function(
        module, assert, isArray, isNumber, isObject, moment, // deps
        Logger, // wilton
        conf, user // local
) {
    "use strict";
    var logger = new Logger(module.id);
    logger.info(module.id);

    // save
    var id = user.save({
        nick: "foo",
        email: "bar@baz.com",
        spam: false
    });
    assert(isNumber(id));
    assert(id > 0);

    // load
    var loaded = user.loadById(id);
    assert(isObject(loaded));
    assert.equal(loaded.id, id);
    assert.equal(loaded.nick, "foo");
    assert.equal(loaded.email, "bar@baz.com");
    assert.equal(loaded.spam, false);
    assert(moment(loaded.dateAdded).isValid());

    // find
    var foundBefore = user.find({
        nick: "bar"
    }).length;
    user.save({
        nick: "bar1",
        email: "bar1@baz.com",
        spam: false
    });
    user.save({
        nick: "bar2",
        email: "bar2@baz.com",
        spam: true
    });
    var found = user.find({
        nick: "bar"
    });
    assert(isArray(found));
    assert.equal(found.length, foundBefore + 2);

    var empty = user.find({
        nick: "fail"
    });
    assert(isArray(empty));
    assert.equal(empty.length, 0);
});
