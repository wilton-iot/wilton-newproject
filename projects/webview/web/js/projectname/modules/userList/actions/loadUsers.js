/*
{{license}}
 */

define([
    "vue-require/websocket/backendcall"
], function(backendcall) {
    "use strict";

    return function(context, cb) {
        backendcall({
            module: "{{projectname}}/server/calls/users",
            func: "listByNick",
            args: [""]
        }, function(err, res) {
            if (null !== err) {
                context.commit("setError", err);
                cb(err);
                return;
            }
            context.commit("updateUsers", res);
            cb(null);
        });
    };
});
