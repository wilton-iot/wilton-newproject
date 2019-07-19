/*
{{license}}
 */

define([
    "vue",
    "vue-require/websocket/withSock",
    "json!/{{projectname}}/server/views/config",
    "text!./app.html"
], function(Vue, withSock, conf, template) {
    "use strict";

    return Vue.component("App", {
        template: template,

        components: {
        },

        created: function() {
            // no networking here, only supplying ws options 
            withSock(null, {
                url: conf.wsUrl
                // other possible options are forwarded to wsClient
                // https://wilton-iot.github.io/wilton/docs/html/namespaceweb__wsClient.html#a9a7f2f55ba84b066190bb357f45a7d36
            });
        },

        methods: {
            top: function() {
                window.scrollTo(0, 0);
            }
        }
    });
});
