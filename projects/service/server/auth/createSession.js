/*
{{license}}
 */

"use strict";

define([
    // libs
    "module",
    "lodash/filter",
    "lodash/forOwn",
    "moment",
    "random",
    // wilton
    "wilton/Channel",
    "wilton/Logger",
    // local
    "../conf",
    "./sessionsStore",
    "./usersStore"
], (
        module, filter, forOwn, moment, Random, // libs
        Channel, Logger, // wilton
        conf, sessionsStore, usersStore // local
) => {
    const logger = new Logger(module.id);

    const lock = Channel.lookup("{{projectname}}/server/auth/lock");
    const rand = new Random(Random.engines.mt19937().autoSeed());

    return (user, authRequest) => {
        return lock.synchronize(() => {
            logger.debug("Creating user session, login: [" + user.login + "] ...");

            // find out all sessions for this user
            const existingKeys = usersStore.get(user.login);
            let keys = null !== existingKeys ? existingKeys : [];
            logger.debug("Simultaneous sessions found, keys: [" + JSON.stringify(keys) + "]");

            const now = moment();

            // check existing logins for this user
            if (keys.length > 0) {
                // cleanup expired sessions
                const existingSessions = sessionsStore.getBatch(keys);
                const expiredKeys = [];
                forOwn(existingSessions, (ss, key) => {
                    const validUntil = moment(ss.sessionStartTime).add(ss.sessionDurationMinutes, "minutes");
                    if (now.isAfter(validUntil)) {
                        expiredKeys.push(key);
                    }
                });
                logger.debug("Expired sessions found, keys: [" + JSON.stringify(expiredKeys) + "]");
                if (expiredKeys.length > 0) {
                    keys = filter(keys, (key) => {
                        !expiredKeys.includes(key);
                    });
                }

                // check too many simultaneous logins
                const simultaneousKeys = [];
                while (keys.length >= conf.auth.userMaxSimultaneousLogins) {
                    simultaneousKeys.push(keys.shift());
                }
                logger.debug("Simultaneous exceeded sessions found, keys: [" + JSON.stringify(simultaneousKeys) + "]");

                // remove expired and simultaneous
                const keysToRemove = expiredKeys.concat(simultaneousKeys);
                if (keysToRemove.length > 0) {
                    const keysRemoved = sessionsStore.removeBatch(keysToRemove);
                    if (keysRemoved.length !== keysToRemove.length) {
                        logger.warn("Inconsistent session data found," +
                                " user id: [" + user.id + "]," +
                                " login: [" + user.login + "]," +
                                " sessions to remove: [" + JSON.stringify(keysToRemove, null, 4) + "]," +
                                " expected count: [" + keysToRemove.length + "]," +
                                " actual count: [" + keysRemoved.length + "]");
                    }
                    logger.debug("Existing sessions removed, keys: [" + JSON.stringify(keysToRemove) + "]");
                }
            }

            // create session
            const sessionKey = rand.uuid4();
            keys.push(sessionKey);
            usersStore.put(user.login, keys);
            const session = {
                id: user.login,
                role: user.role,
                sessionStartTime: now.format()
            };
            sessionsStore.put(sessionKey, session);
            logger.debug("Session created, key: [" + sessionKey + "]," +
                    " value: [" + JSON.stringify(session, null, 4) + "]");

            return sessionKey;
        });
    };
});