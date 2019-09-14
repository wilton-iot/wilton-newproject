/*
{{license}}
 */

define([
    // deps
    "module",
    "lodash/includes",
    "lodash/isNil",
    // pwdauth
    "pwdauth/authenticate",
    "pwdauth/authErrors",
    "pwdauth/createRequest",
    // wilton
    "wilton/Logger",
    // local
    "./loadUser",
    "./createSession"
], function(
        module, includes, isNil, // deps
        authenticate, authErrors, createRequest, // pwdauth
        Logger, // wilton
        loadUser, createSession // local
) {
    "use strict";
    var logger = new Logger(module.id);

    function send400(req) {
        req.sendResponse("", {
            meta: {
                statusCode: 400,
                statusMessage: "Bad Request"
            }
        });
    }

    return {
        POST: function(req) {
            // check auth request
            try {
                // check auth request format
                req.json();
            } catch(e) {
                logger.warn("Invalid login attempt, error: [request malformed]");
                send400(req);
                return;
            }
            if ("/{{projectname}}/server/auth/login" !== req.json().path) {
                logger.warn("Invalid login attempt, error: [invalid path]," +
                        " req: [" + JSON.stringify(req.json()) + "]");
                send400(req);
                return;
            }

            // authenticate
            var token = authenticate(loadUser, createRequest, createSession, req.json());

            // check errors
            if (!isNil(token.error)) {
                logger.warn("Invalid login attempt, error: [" + token.error + "]," +
                        " req: [" + JSON.stringify(req.json()) + "]");
                if (includes([authErrors.USER_NOT_FOUND,
                        authErrors.INVALID_REQUEST_HASH,
                        authErrors.INVALID_SESSION_KEY], token.error)) {
                    req.sendResponse("", {
                        meta: {
                            statusCode: 403,
                            statusMessage: "Forbidden"
                        }
                    });
                } else {
                    send400(req);
                }
            } else {
                logger.info("Login successful, login: [" + req.json().key + "]," +
                        " sessionKey: [" + token.sessionKey + "]");
                req.sendResponse(token);
            }
        }
    };
});
