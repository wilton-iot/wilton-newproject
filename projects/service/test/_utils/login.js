/*
{{license}}
 */

"use strict";

define([
    "assert",
    "moment",
    "pwdauth/createRequest",
    "pwdauth/createPasswordHash",
    "wilton/httpClient",
    "{{projectname}}/server/conf"
], (assert, moment, createRequest, createPasswordHash, http, conf) => {

    return (login, password) => {
        const url = "http://127.0.0.1:" + conf.server.tcpPort + "/{{projectname}}/server/auth/login";
        const resp = http.sendRequest(url, {
            data: createRequest(
                    "{{projectname}}/server/auth/login",
                    login,
                    createPasswordHash(password, login),
                    moment().format())
        });
        assert.equal(resp.responseCode, 200);
        return resp.json().sessionKey;
    };
});