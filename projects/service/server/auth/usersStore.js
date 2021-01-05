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

    const channel = Channel.lookup("{{projectname}}/server/auth/usersStore");
    const handle = channel.peek().kvstoreHandle;
    return new KVStore(handle);
});
