/*
{{license}}
 */

define(function(require) {
    "use strict";

    var Vue = require("vue");
    var VueRouter = require("vue-router");
    var routerHolder = require("vue-require/router/routerHolder");

    Vue.use(VueRouter);

    var res = new VueRouter({
        linkActiveClass: "active",
        linkExactActiveClass: "active",
        routes: [
            { path: "/", redirect: "/landing" },
            { path: "/landing", component: require("./modules/landing/landing") },
            { path: "/userList", component: require("./modules/userList/userList") }
        ]
    });

    routerHolder.set(res);

    return res;
});
