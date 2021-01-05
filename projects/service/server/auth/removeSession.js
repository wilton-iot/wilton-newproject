/*
{{license}}
 */

"use strict";

define([
    "module",
    "lodash/filter",
    "wilton/Channel",
    "wilton/Logger",
    "./sessionsStore",
    "./usersStore"
], (module, filter, Channel, Logger, sessionsStore, usersStore) => {
    const logger = new Logger(module.id);

    const lock = Channel.lookup("{{projectname}}/server/auth/lock");

    return (sessionKey) => {
        return lock.synchronize(() => {

            // find out and remove session
            logger.debug("Removing session record, key: [" + sessionKey + "] ...");
            const user = sessionsStore.get(sessionKey);
            if (null === user) {
                logger.warn("Invalid deauthorize attempt, session not found, key: [" + sessionKey + "]");
                return false;
            }
            sessionsStore.remove(sessionKey);

            // find out all active sessions for this user
            const keys = usersStore.get(user.id);
            if (null === keys) {
                logger.warn("Inconsistent session data, user record not found," +
                        " key: [" + sessionKey + "]," +
                        " session: [" + JSON.stringify(user, null, 4) + "]");
                return false;
            }

            // filter out removed session
            const filtered = filter(keys, (key) => {
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
