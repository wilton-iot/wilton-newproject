/*
{{license}}
 */

define([
    "module",
    "wilton/Channel"
], function(module, Channel) {
    "use strict";

    // get configration provided from index.js
    return Channel.lookup(module.id).peek();
});
