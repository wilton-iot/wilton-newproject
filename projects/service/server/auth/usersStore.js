/*
{{license}}
 */

define([
    "wilton/Channel",
    "wilton/KVStore"
], function(Channel, KVStore) {
    "use strict";

    var channel = Channel.lookup("{{projectname}}/server/auth/usersStore");
    var handle = channel.peek().kvstoreHandle;
    return new KVStore(handle);
});
