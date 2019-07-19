/*
{{license}}
 */

define(function(require) {
    "use strict";

    return {
        namespaced: true,

        actions: {
            loadUsers: require("./actions/loadUsers")
        },

        mutations: {
            setError: require("./mutations/setError"),
            updateUsers: require("./mutations/updateUsers")
        },

        state: {
            users: [],
            error: ""
        }

    };
});
