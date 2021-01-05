/*
{{license}}
 */

"use strict";

define([
    //deps
    "module",
    "assert",
    "lodash/isString",
    "moment",
    // pwdauth
    "pwdauth/createPasswordHash",
    "pwdauth/createRequest",
    // wilton
    "wilton/httpClient",
    "wilton/Logger",
    // local
    "{{projectname}}/server/conf"
], (
        module, assert, isString, moment, // deps
        createPasswordHash, createRequest, // pwdauth
        http, Logger, // wilton
        conf // local
) => {
    const logger = new Logger(module.id);

    logger.info(module.id);

    const loginUrl = "http://127.0.0.1:" + conf.server.tcpPort + "/{{projectname}}/server/auth/login";
    const logoutUrl = "http://127.0.0.1:" + conf.server.tcpPort + "/{{projectname}}/server/auth/logout";

    const login = (login, password) => {
        const resp = http.sendRequest(loginUrl, {
            data: createRequest(
                    "{{projectname}}/server/auth/login",
                    login,
                    createPasswordHash(password, login),
                    moment().format()),
            meta: {
                abortOnResponseError: false
            }
        });
        return resp;
    };

    const logout = (sessionKey) => {
        const resp = http.sendRequest(logoutUrl, {
            meta: {
                method: "POST",
                abortOnResponseError: false,
                headers: {
                    Authorization: sessionKey
                }
            }
        });
        return resp;
    };

    // restricted fail
    assert.equal(logout("fail").responseCode, 403);

    // login fail
    assert.equal(login("fail", "fail").responseCode, 403);

    // login
    const respLogin = login("admin", "password");
    assert.equal(respLogin.responseCode, 200);
    const sessionKey = respLogin.json().sessionKey;
    assert(isString(sessionKey));

    // logout
    assert.equal(logout(sessionKey).responseCode, 200);
    // restricted fail
    assert.equal(logout(sessionKey).responseCode, 403);

    // simultaneous fail
    const keyExp = login("admin", "password").json().sessionKey;
    for (var i = 0; i < conf.auth.userMaxSimultaneousLogins; i++) {
        assert.equal(login("admin", "password").responseCode, 200);
    }
    assert.equal(logout(keyExp).responseCode, 403);

});
