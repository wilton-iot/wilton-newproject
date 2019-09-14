/*
{{license}}
 */

define([
    "module",
    "wilton/Channel"
], function(module, Channel) {
    "use strict";

    // get configration provided from startup thread
    return Channel.lookup(module.id).peek();
});
