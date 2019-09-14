/*
{{license}}
 */

define([
    // libs
    "module",
    "lodash/filter",
    "lodash/forOwn",
    "lodash/includes",
    "moment",
    "random",
    // wilton
    "wilton/Channel",
    "wilton/Logger",
    // local
    "../conf",
    "./sessionsStore",
    "./usersStore"
], function(
        module, filter, forOwn, includes, moment, Random, // libs
        Channel, Logger, // wilton
        conf, sessionsStore, usersStore) {
    "use strict";
    var logger = new Logger(module.id);

    var lock = Channel.lookup("{{projectname}}/server/auth/lock");
    var rand = new Random(Random.engines.mt19937().autoSeed());

    return function(user, authRequest) {
        return lock.synchronize(function() {
            logger.debug("Creating user session, login: [" + user.login + "] ...");

            // find out all sessions for this user
            var existingKeys = usersStore.get(user.login);
            var keys = null !== existingKeys ? existingKeys : [];
            logger.debug("Simultaneous sessions found, keys: [" + JSON.stringify(keys) + "]");

            var now = moment();

            // check existing logins for this user
            if (keys.length > 0) {
                // cleanup expired sessions
                var existingSessions = sessionsStore.getBatch(keys);
                var expiredKeys = [];
                forOwn(existingSessions, function(ss, key) {
                    var validUntil = moment(ss.sessionStartTime).add(ss.sessionDurationMinutes, "minutes");
                    if (now.isAfter(validUntil)) {
                        expiredKeys.push(key);
                    }
                });
                logger.debug("Expired sessions found, keys: [" + JSON.stringify(expiredKeys) + "]");
                if (expiredKeys.length > 0) {
                    keys = filter(keys, function(key) {
                        !includes(expiredKeys, key);
                    });
                }

                // check too many simultaneous logins
                var simultaneousKeys = [];
                while (keys.length >= conf.auth.userMaxSimultaneousLogins) {
                    simultaneousKeys.push(keys.shift());
                }
                logger.debug("Simultaneous exceeded sessions found, keys: [" + JSON.stringify(simultaneousKeys) + "]");

                // remove expired and simultaneous
                var keysToRemove = expiredKeys.concat(simultaneousKeys);
                if (keysToRemove.length > 0) {
                    var keysRemoved = sessionsStore.removeBatch(keysToRemove);
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
            var sessionKey = rand.uuid4();
            keys.push(sessionKey);
            usersStore.put(user.login, keys);
            var session = {
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