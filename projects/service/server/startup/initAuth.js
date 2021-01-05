/*
{{license}}
 */

"use strict";

define([
    "module",
    "wilton/Channel",
    "wilton/KVStore",
    "wilton/Logger"
], (module, Channel, KVStore, Logger) => {
    const logger = new Logger(module.id);

    return (conf) => {
        if (!conf.auth.enabled) {
            logger.warn("Attention! Authentication is disabled.");
            return;
        }
        // lock
        new Channel("{{projectname}}/server/auth/lock", 1);

        // sessions
        const sessionsStore = new KVStore(conf.auth.sessionsStorePath);
        new Channel("{{projectname}}/server/auth/sessionsStore", 1).send({
            kvstoreHandle: sessionsStore.handle
        });
        
        //users
        const usersStore = new KVStore(conf.auth.usersStorePath);
        new Channel("{{projectname}}/server/auth/usersStore", 1).send({
            kvstoreHandle: usersStore.handle
        });
    };
});
