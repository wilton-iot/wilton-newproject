/*
{{license}}
 */

define([
    // deps
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
    "{{projectname}}/server/models/note"
], function(
        module, assert, isArray, isNumber, isObject, moment, // deps
        Logger, // wilton
        conf, note // local
) {
    "use strict";
    var logger = new Logger(module.id);
    logger.info(module.id);

    // save
    var id = note.save({
        title: "foo",
        contents: "bar baz com",
        important: false
    });
    assert(isNumber(id));
    assert(id > 0);

    // load
    var loaded = note.loadById(id);
    assert(isObject(loaded));
    assert.equal(loaded.id, id);
    assert.equal(loaded.title, "foo");
    assert.equal(loaded.contents, "bar baz com");
    assert.equal(loaded.important, false);
    assert(moment(loaded.dateAdded).isValid());

    // find
    var foundBefore = note.findByTitle("bar").length;
    note.save({
        title: "bar1",
        contents: "bar1 baz com",
        important: false
    });
    note.save({
        title: "bar2",
        contents: "bar2 baz com",
        important: true
    });
    var found = note.findByTitle("bar");
    assert(isArray(found));
    assert.equal(found.length, foundBefore + 2);

    var empty = note.findByTitle("fail");
    assert(isArray(empty));
    assert.equal(empty.length, 0);
});
