/*
{{license}}
 */

"use strict";

define([
    "module",
    "wilton/Channel"
], (module, Channel) => {

    // get configration provided from startup thread
    return Channel.lookup(module.id).peek();
});
