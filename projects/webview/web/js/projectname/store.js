/*
{{license}}
 */

define(function(require) {
    "use strict";

    var Vue = require("vue");
    var Vuex = require("vuex");
    var storeHolder = require("vue-require/store/storeHolder");

    Vue.use(Vuex);

    var res = new Vuex.Store({
        strict: true,

        actions: {
        },

        modules: {
            userList: require("./modules/userList/userListStore")
        },

        mutations: {
            updateCanGoBack: require("./common/mutations/updateCanGoBack"),
            updateCanGoForward: require("./common/mutations/updateCanGoForward")
        },

        state: {
        }
    });

    storeHolder.set(res);

    return res;
});
