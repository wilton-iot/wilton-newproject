/*
{{license}}
 */

define([
    "module",
    "wilton/Channel",
    "wilton/KVStore",
    "wilton/Logger"
], function(module, Channel, KVStore, Logger) {
    "use strict";
    var logger = new Logger(module.id);

    return function(conf) {
        if (!conf.auth.enabled) {
            logger.warn("Attention! Authentication is disabled.");
            return;
        }
        // lock
        new Channel("{{projectname}}/server/auth/lock", 1);

        // sessions
        var sessionsStore = new KVStore(conf.auth.sessionsStorePath);
        new Channel("{{projectname}}/server/auth/sessionsStore", 1).send({
            kvstoreHandle: sessionsStore.handle
        });
        
        //users
        var usersStore = new KVStore(conf.auth.usersStorePath);
        new Channel("{{projectname}}/server/auth/usersStore", 1).send({
            kvstoreHandle: usersStore.handle
        });
    };
});
