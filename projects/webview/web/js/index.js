/*
{{license}}
 */

// top level define required because enforceDefine is used

define([], function() {

    // requirejs config, adjust as needed
    requirejs.config({
        baseUrl: "/stdlib/",
        enforceDefine: true,
        nodeIdCompat: true,
        waitSeconds: 15,
        paths: {
            "{{projectname}}": "/web/js/{{projectname}}"
        },
        // these plugins are used to load wilton-packages.json
        packages: [
            {name: "text", main: "text"},
            {name: "json", main: "json"}
        ]
    });

    // load packages config and compat globals
    require(["json!wilton-requirejs/wilton-packages.json",
            "wilton-requirejs/compatGlobals"], function(packages) {

        // complete config
        requirejs.config({
            packages: packages
        });

        // init buffer
        require(["buffer"], function(buffer) {
            // set global compat Buffer
            Buffer = buffer.Buffer;

            // start app
            require([
                "vue",
                "{{projectname}}/router",
                "{{projectname}}/store",
                "{{projectname}}/app"
            ], function(Vue, router, store, app) {
                new Vue({
                    el: '#root',
                    router: router,
                    store: store,
                    template: "<App/>"
                });
            });
        });
    });
});
