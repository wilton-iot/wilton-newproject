/*
{{license}}
 */

define([
    //deps
    "module",
    "assert",
    // lodash
    "lodash/isArray",
    "lodash/isInteger",
    "lodash/isObject",
    "lodash/isString",
    // wilton
    "wilton/httpClient",
    "wilton/Logger",
    // local
    "{{projectname}}/server/conf",
    "../_utils/login"
], function(
        module, assert, // deps
        isArray, isInteger, isObject, isString, // lodash
        http, Logger, // wilton
        conf, login // local
) {
    "use strict";
    var logger = new Logger(module.id);

    logger.info(module.id);

    var url = "http://127.0.0.1:" + conf.server.tcpPort + "/{{projectname}}/server/views/notes";

    // auth
    var headers = {
        Authorization: login("admin", "password")
    };

    // list
    var resp1 = http.sendRequest(url + "?title=", {
        meta: {
            headers: headers
        }
    });
    assert.equal(resp1.responseCode, 200);
    assert(isObject(resp1.json()));
    assert(isArray(resp1.json().notes));
    var countBefore = resp1.json().notes.length;

    // add
    var resp2 = http.sendRequest(url, {
        data: {
            title: "foo",
            contents: "baz bar com",
            important: false
        },
        meta: {
            headers: headers
        }
    });
    assert.equal(resp2.responseCode, 200);
    assert(isObject(resp2.json()));
    assert(isInteger(resp2.json().id));
    assert(resp2.json().id > 0);

    // validation
    var resp3 = http.sendRequest(url, {
        data: {
            title: null,
            contents: "baz bar com",
            important: false
        }, meta: {
            abortOnResponseError: false,
            headers: headers
        }
    });
    assert.equal(resp3.responseCode, 400);
    assert(isObject(resp3.json()));
    assert(isObject(resp3.json().errors));
    assert(isString(resp3.json().errors.title));

    // list
    var resp4 = http.sendRequest(url + "?title=", {
        meta: {
            headers: headers
        }
    });
    assert.equal(resp4.responseCode, 200);
    assert(isObject(resp4.json()));
    assert(isArray(resp4.json().notes));
    assert.equal(resp4.json().notes.length, countBefore + 1);
});
