/*
{{license}}
 */

define([
    "module",
    "vue-require/router/push",
    "{{projectname}}/components/header/Header",
    "text!./landing.html"
], function (module, push, Header, template) {
    "use strict";

    return {
        template: template,

        components: {
            "{{projectname}}-header": new Header("WebView Application",
                    "Example of the application with Web frontend and WebSocket transport")
        },

        data: function() {
            return {
            };
        },

        methods: {
            toUserList: function() {
                push("/userList");
            }
        }
    };
});
