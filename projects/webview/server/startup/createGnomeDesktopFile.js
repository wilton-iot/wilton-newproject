/*
{{license}}
 */

define([
    "module",
    // wilton
    "wilton/fs",
    "wilton/Logger",
    "wilton/mustache",
    // local
    "text!./gnome.desktop"
], function(
        module,
        fs, Logger, mustache, // wilton
        gdt // local
) {
    "use strict";
    var logger = new Logger(module.id);

    return function(conf) {
        var path = conf.appdir + "work/{{projectname}}.desktop";
        var text = mustache.render(gdt, {
            appdir: conf.appdir
        });
        fs.writeFile(path, text);
        print("Desktop file written, path [" + path + "]");
        print("Copy it to '~/Desktop/' to install desktop shortcut");
        print("Copy it to '~/.config/autostart/' to enable autostart on login");
    };

});
