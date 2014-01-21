/* jshint camelcase: false */
"use strict";

module.exports = function(grunt) {

    var crypto = require("crypto");
    var currentDate = (new Date()).valueOf().toString();
    var random = Math.random().toString();
    var id = crypto.createHash("sha1").update(currentDate + random).digest("hex");
    var globalConfig = {
        id: id
    };

    // Project configuration.
    grunt.initConfig({
        globalConfig: globalConfig,
        dest: "_site",
        src: "source",

        // Copy files that don't need compilation to dist/
        copy: {
            dist: {
                files: [
                    {dest: "<%= dest %>/", src: "assets/js/jquery*.min.js", expand: true, cwd: "<%= src %>/"},
                ]
            }
        },

        jekyll: {
            site: {}
        },

        connect: {
            server: {
                options: {
                    base: "<%= dest %>/",
                    port: 8000
                }
            }
        },

        watch: {
            files: ["<%= src %>/**/*", ".jshintrc", "_config.yml", "Gruntfile.js"],
            tasks: "build",
            options: {
                livereload: true
            }
        },

        includereplace: {
            dist: {
                options: {
                    globals: {
                        HASH: id
                    }
                },
                files: [
                    {src: "**/*.html", dest: "<%= dest %>/", expand: true, cwd: "<%= dest %>/"}
                ]
            }
        },

        jshint: {
            options: {
                jshintrc: ".jshintrc"
            },
            files: {
                src: ["Gruntfile.js", "<%= src %>/assets/js/plugins.js"]
            }
        },

        csslint: {
            src: "<%= src %>/assets/css/style.css"
        },

        concat_css: {
            dist: {
                src: ["<%= src %>/assets/css/bootstrap.css",
                      "<%= src %>/assets/css/font-awesome.css",
                      "<%= src %>/assets/css/jquery.fancybox.css",
                      "<%= src %>/assets/css/jquery.fancybox-thumbs.css",
                      "<%= src %>/assets/css/style.css"],
                dest: "<%= dest %>/assets/css/pack.css"
            }
        },


        cssmin: {
            minify: {
                options: {
                    keepSpecialComments: 0,
                    report: "min",
                    selectorsMergeMode: "ie8"
                },
                files: {
                    "<%= dest %>/assets/css/pack-<%= globalConfig.id %>.css": "<%= uncss.dist.dest %>"
                }
            }
        },

        uglify: {
            options: {
                /*compress: true,*/
                mangle: true,
                preserveComments: false,
                report: "min"
            },
            minify: {
                files: {
                    "<%= dest %>/assets/js/pack-<%= globalConfig.id %>.js": ["<%= src %>/assets/js/plugins.js",
                                                                             "<%= src %>/assets/js/bootstrap.js",
                                                                             "<%= src %>/assets/js/jquery.mousewheel.js",
                                                                             "<%= src %>/assets/js/jquery.fancybox.js",
                                                                             "<%= src %>/assets/js/jquery.fancybox-thumbs.js"]
                }
            },
            minifyIE: {
                files: {
                    "<%= dest %>/assets/js/html5shiv-respond.min.js": ["<%= src %>/assets/js/html5shiv.js",
                                                                       "<%= src %>/assets/js/respond.js"]
                }
            }
        },

        uncss: {
            options: {
                //stylesheets: "<%= concat_css.dist.dest %>"
                csspath: "<%= dest %>/assets/css/"
            },
            dist: {
                src: "<%= dest %>/**/*.html",
                dest: "<%= dest %>/assets/css/tidy.css"
            }
        },

        validation: {
            options: {
                charset: "utf-8",
                doctype: "HTML5",
                reset: true
            },
            files: {
                src: "<%= dest %>/**/*.html"
            }
        },

        clean: {
            dist: "<%= dest %>/"
        }

    });

    // Load any grunt plugins found in package.json.
    require("load-grunt-tasks")(grunt, {scope: "devDependencies"});

    grunt.registerTask("build", ["jekyll", "copy", "includereplace", "concat_css", "uncss", "cssmin", "uglify"]);
    grunt.registerTask("default", ["build", "connect", "watch"]);
    grunt.registerTask("test", ["build", "csslint", "jshint", "validation"]);

};
