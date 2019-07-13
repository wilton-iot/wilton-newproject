/*
{{license}}
 */

define([
    "assert",
    "wilton/Logger",
    "./{{projectname}}"
], function(assert, Logger, {{projectname}}) {
    "use strict";

    return {
        main: function() {
            Logger.initConsole("WARN");

            // checks go here
            assert(true);
            var a = 42;
            assert.equal(a, 42);

            print("Tests passed");
        }
    };
});
