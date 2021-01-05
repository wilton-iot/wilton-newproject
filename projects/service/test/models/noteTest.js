/*
{{license}}
 */

"use strict";

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
], (
        module, assert, isArray, isNumber, isObject, moment, // deps
        Logger, // wilton
        conf, note // local
) => {
    const logger = new Logger(module.id);
    logger.info(module.id);

    // save
    const id = note.save({
        title: "foo",
        contents: "bar baz com",
        important: false
    });
    assert(isNumber(id));
    assert(id > 0);

    // load
    const loaded = note.loadById(id);
    assert(isObject(loaded));
    assert.equal(loaded.id, id);
    assert.equal(loaded.title, "foo");
    assert.equal(loaded.contents, "bar baz com");
    assert.equal(loaded.important, false);
    assert(moment(loaded.dateAdded).isValid());

    // find
    const foundBefore = note.findByTitle("bar").length;
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
    const found = note.findByTitle("bar");
    assert(isArray(found));
    assert.equal(found.length, foundBefore + 2);

    const empty = note.findByTitle("fail");
    assert(isArray(empty));
    assert.equal(empty.length, 0);
});
