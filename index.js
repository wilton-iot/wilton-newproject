/*
 * Copyright 2019, alex at staticlibs.net
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

define([
    "module",
    // libs
    "moment",
    // lodash
    "lodash/find",
    "lodash/forEach",
    "lodash/isString",
    "lodash/map",
    // wilton
    "wilton/fs",
    "wilton/misc",
    "wilton/mustache",
    "wilton/utils",
    // local
    "json!./licenses/list.json",
    "json!./projects/list.json"
], function(
        module, // module
        moment, // libs
        find, forEach, isString, map, // lodash
        fs, misc, mustache, utils, // wilton
        licenses, projects
) {
    "use strict";
    utils.checkRootModuleName(module, "wilton-newproject");

    function chooseProjectType() {
        for(;;) {
            print("");
            print("Choose a project type (1 - " + projects.length + "):");
            forEach(projects, function(pr, i) {
                print((i + 1) + ". " + pr.label + ":");
                print("    " + pr.description);
            });
            var resp = misc.stdinReadline().trim();
            var num = parseInt(resp, 10);
            if (num > 0 && num <= projects.length) {
                return projects[num - 1].name;
            }
        }
    }

    function enterAuthorName() {
        for(;;) {
            print("");
            print("Enter the name of the project author:");
            var resp = misc.stdinReadline().trim();
            if (resp.length > 0) {
                return resp;
            }
        }
    }

    function chooseLicense() {
        for(;;) {
            print("");
            print("Choose a license header for source files (1 - " + licenses.length + "):");
            forEach(licenses, function(li, i) {
                var name = li.replace(/\.txt$/, "");
                print((i + 1) + ". " + name);
            });
            var resp = misc.stdinReadline().trim();
            var num = parseInt(resp, 10);
            if (num > 0 && num <= licenses.length) {
                var mid = "text!wilton-newproject/licenses/" + licenses[num - 1];
                var res = null;
                require([mid], function(text) {
                    res = text;
                });
                return res;
            }
        }
    }

    function writeFiles(projectname, ptype, license) {
        var pr = find(projects, ["name", ptype]);
        forEach(pr.files, function(fi) {
            var mid = "text!wilton-newproject/projects/" + ptype + "/" + fi;
            if (utils.endsWith(mid, ".js")) {
                mid += ".js"; // text plugin workaround
            }
            var template = null;
            require([mid], function(loaded) {
                template = loaded;
            });
            var text = mustache.render(template, {
                license: license,
                projectname: projectname,
                mustache_open_brackets: "{{{",
                mustache_close_brackets: "}}}",
                vue_open_brackets: "{{",
                vue_close_brackets: "}}"
            });
            var pfi = fi.replace(/\/projectname\//, "/" + projectname + "/");
            var fdir = -1 !== pfi.indexOf("/") ? pfi.replace(/\/[^\/]*$/, "") : "";
            var fname = fi.replace(/^.*\//, "");
            var fext = fname.replace(/^.*\./, ".");
            var name = "projectname" + fext === fname ? (projectname + fext) : fname;
            var fdirSlash = fdir.length > 0 ? fdir + "/" : "";
            var path = projectname + "/" + fdirSlash + name;
            if (fdir.length > 0) {
                var dirs = fdir.split("/");
                var prefix = projectname;
                forEach(dirs, function(di) {
                    var dp = prefix + "/" + di;
                    if (!fs.exists(dp)) {
                        fs.mkdir(dp);
                    }
                    prefix = dp;
                });
            }
            fs.writeFile(path, text);
            print(path);
        });
    }

    return {
        main: function(projectname) {
            if (!(isString(projectname) && projectname.length > 0 &&
                        /^[a-zA-Z0-9_]+$/.test(projectname))) {
                print("Error: invalid project name specified: [" + projectname + "]");
                print("Usage: wilton -n -- myproject");
                return 1;
            }

            print("Creating a project: [" + projectname + "]");

            if (fs.exists(projectname)) {
                print("Error: cannot create directory: [" + projectname + "]");
                return 1;
            }

            var ptype = chooseProjectType();
            var author = enterAuthorName();
            var tlicense = chooseLicense();
            var year = moment().format("YYYY");
            var license = mustache.render(tlicense, {
                year: year,
                author: author
            });

            print("Project setup complete, press any key to write project files ...");
            misc.stdinReadline();

            fs.mkdir(projectname);
            writeFiles(projectname, ptype, license);
            print("");
            print("Project files written successfully");
            print("Type 'wilton " + projectname + "/index.js' to run the application");
        }
    };
});