/*
{{license}}
 */

define([
    "vue"
], function(Vue) {
    "use strict";

    return function(state, err) {
        Vue.set(state, "error", String(err));
    };
});
