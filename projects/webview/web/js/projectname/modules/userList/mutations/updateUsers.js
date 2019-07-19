/*
{{license}}
 */

define([
    "vue"
], function(Vue) {
    "use strict";

    return function(state, res) {
        Vue.set(state, "users", res);
    };
});
