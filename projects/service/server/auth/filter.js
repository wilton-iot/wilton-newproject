/*
{{license}}
 */

"use strict";

define([
    // libs
    "module",
    "lodash/mapValues",
    "pwdauth/authErrors",
    "pwdauth/authorize",
    "wilton/Logger",
    // local
    "../conf",
    "./removeSession",
    "./sessionsStore"
], (
        module, mapValues, authErrors, authorize, Logger, // libs
        conf, removeSession, sessionsStore // local
) => {
    const logger = new Logger(module.id);

    const roles = mapValues(conf.auth.roles, (paths) => {
        return paths.map((pa) => {
            return new RegExp("^" + pa + "$");
        });
    });
    
    function loadUserFromSession(sessionKey) {
        const user = sessionsStore.get(sessionKey);
        if (null !== user) {
            user.sessionDurationMinutes = conf.auth.sessionDurationMinutes;
            user.rights = []; // not used, required by pwdauth
        }
        return user;
    }

    function send403(req) {
        req.sendResponse("", {
            meta: {
                statusCode: 403,
                statusMessage: "Forbidden"
            }
        });
    }

    return (req, doFilter) => {
        // check auth enabled
        if (!conf.auth.enabled) {
            doFilter(req);
            return;
        }

        // requested path
        const path = req.meta().pathname;

        logger.debug("Checking request, path: [" + path + "] ...");
        // check path allowed without authentication
        for (let i = 0; i < roles.public.length; i++) {
            const regex = roles.public[i];
            if (regex.test(path)) {
                logger.debug("Request allowed, role: [public]");
                doFilter(req);
                return;
            }
        }

        // check auth header specified
        if (!req.headers().hasOwnProperty("Authorization")) {
            logger.warn("Invalid access attempt: 'Authorization' header absent");
            send403(req);
            return;
        }

        // check session key
        const sessionKey = req.headers().Authorization;
        logger.debug("Checking session, key: [" + sessionKey + "]");
        const authResult = authorize(loadUserFromSession, {
            sessionKey: sessionKey
        });

        // check errors
        if ("undefined" !== typeof(authResult.error) && null !== authResult.error) {
            if (authErrors.TOKEN_EXPIRED === authResult.error) {
                logger.debug("Removind expired session ...");
                var removed = removeSession(sessionKey);
                if (removed) {
                    logger.debug("Expired session removed successfully");
                } else {
                    logger.warn("Inconsistent session data, expired session not found," +
                            " key: [" + sessionKey + "]");
                }
            } else {
                logger.warn("Invalid access attempt, error: [" + authResult.error + "]," +
                        " key: [" + sessionKey + "], path: [" + path + "]");
            }
            send403(req);
            return;
        }

        // check role
        if ("undefined" === typeof(roles[authResult.role])) {
            logger.warn("Invalid role, name: [" + authResult.role + "]");
            send403(req);
            return;
        }

        // check path
        logger.debug("Checking access, role: [" + authResult.role + "]...");
        const regexList = roles[authResult.role];
        for (let i = 0; i < regexList.length; i++) {
            const regex = regexList[i];
            if (regex.test(path)) {
                logger.debug("Request allowed, path template: [" + regex + "]");
                // pass request
                req.headers()[conf.auth.headers.login] = authResult.id;
                req.headers()[conf.auth.headers.role] = authResult.role;
                doFilter(req);
                return;
            }
        }
        logger.warn("Invalid access attempt," +
                " path: [" + path + "]," +
                " login: [" + authResult.id + "]," +
                " role: [" + authResult.role + "]");
        send403(req);
    };
});
