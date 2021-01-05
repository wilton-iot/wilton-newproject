/*
{{license}}
 */

"use strict";

define([
    "assert",
    "wilton/Logger",
    "./{{projectname}}"
], function(assert, Logger, {{projectname}}) {

    return () => {
        Logger.initConsole("WARN");

        // checks go here
        assert(true);
        const a = 42;
        assert.equal(a, 42);

        print("Tests passed");
    };
});
