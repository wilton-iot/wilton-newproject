/*
{{license}}
 */

define([
    "text!./Header.html"
], function(template) {
    "use strict";

    return function(label, description) {
        this.template = template;

        this.data = function() {
            return {
                label: label,
                description: description
            };
        };
    };
});
