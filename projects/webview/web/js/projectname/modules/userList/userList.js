/*
{{license}}
 */

define([
    "module",
    "lodash/bind",
    "vue-require/router/push",
    "vue-require/store/dispatch",
    "vue-require/store/state",
    "{{projectname}}/components/header/Header",
    "text!./userList.html"
], function (module, bind, push, dispatch, state, Header, template) {
    "use strict";

    return {
        template: template,

        components: {
            "{{projectname}}-header": new Header("Users",
                    "List of registered users")
        },

        computed: {
            users: function() {
                return state(module).users;
            },
            tableCss: function() {
                return {
                    "table": true,
                    "table-sm": true,
                    "table-bordered": true,
                    "table-striped": !this.loading,
                    "text-muted": this.loading,
                    "bg-light": this.loading
                };
            }
        },

        data: function() {
            return {
                loading: false,
                infoCss: {
                    "mt-2": true,
                    "alert": true,
                    "alert-primary": true,
                    "alert-light": false,
                    "alert-danger": false
                },
                infoText: "Loading ..."

            };
        },

        methods: {
            toLanding: function() {
                push("/landing");
            }
        },

        mounted: function() {
            this.loading = true;
            dispatch("userList/loadUsers", bind(function(err) {
                this.loading = false;
                this.infoCss["alert-primary"] = false;
                if (null !== err) {
                    this.infoText = state(module).error;
                    this.infoCss["alert-danger"] = true;
                } else {
                    this.infoText = "Data loaded";
                    this.infoCss["alert-light"] = true;
                }
            }, this));
        }
    };
});
