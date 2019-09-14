/*
{{license}}
 */

define([
    "module",
    "lodash/filter",
    "wilton/Channel",
    "wilton/Logger",
    "./sessionsStore",
    "./usersStore"
], function(module, filter, Channel, Logger, sessionsStore, usersStore) {
    "use strict";
    var logger = new Logger(module.id);

    var lock = Channel.lookup("{{projectname}}/server/auth/lock");

    return function(sessionKey) {
        return lock.synchronize(function() {

            // find out and remove session
            logger.debug("Removing session record, key: [" + sessionKey + "] ...");
            var user = sessionsStore.get(sessionKey);
            if (null === user) {
                logger.warn("Invalid deauthorize attempt, session not found, key: [" + sessionKey + "]");
                return false;
            }
            sessionsStore.remove(sessionKey);

            // find out all active sessions for this user
            var keys = usersStore.get(user.id);
            if (null === keys) {
                logger.warn("Inconsistent session data, user record not found," +
                        " key: [" + sessionKey + "]," +
                        " session: [" + JSON.stringify(user, null, 4) + "]");
                return false;
            }

            // filter out removed session
            var filtered = filter(keys, function(key) {
                return key !== sessionKey;
            });
            if (filtered.length === keys.length) {
                logger.warn("Inconsistent session data, session not found in user record," +
                        " key: [" + sessionKey + "]," +
                        " session: [" + JSON.stringify(user, null, 4) + "]");
                return false;
            }

            // update user record
            if (0 === filtered.length) {
                usersStore.remove(user.id);
            } else {
                usersStore.put(user.id, filtered);
            }

            logger.debug("Session record removed successfully," +
                    " login: [" + user.id + "]," +
                    " remaining sessions: [" + JSON.stringify(filtered) + "]");
            return true;
        });
    };
});
