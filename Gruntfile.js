"use strict";

module.exports = function(grunt) {

    grunt.initConfig({

        // Copy files that don't need compilation to dist/
        copy: {
            dist: {
                files: [
                    {dest: "_site/", src: "assets/js/jquery*.min.js", expand: true, cwd: "source/"},
                ]
            }
        },

        jekyll: {
            site: {}
        },

        connect: {
            server: {
                options: {
                    base: "_site/",
                    port: 8000
                }
            }
        },

        watch: {
            files: ["source/**/*", ".jshintrc", "_config.yml", "Gruntfile.js"],
            tasks: ["build"],
            options: {
                livereload: true
            }
        },

        rev: {
            assets: {
                files: {
                    src: [
                        "_site/assets/css/**/{,*/}*.css",
                        "_site/assets/js/**/{,*/}*.js",
                        //"_site/assets/img/**/*.{jpg,jpeg,gif,png}",
                        "_site/assets/fonts/**/*.{eot,svg,ttf,woff}"
                    ]
                }
            }
        },

        useminPrepare: {
            html: "_site/index.html"
        },

        usemin: {
            html: ["_site/**/*.html"],
            options: {
                dirs: ["_site/assets"]
            }
        },

        cssmin: {
            options: {
                keepSpecialComments: 0,
                report: "min",
                selectorsMergeMode: "ie8"
            }
        },

        uglify: {
            options: {
                /*compress: true,*/
                mangle: true,
                preserveComments: false,
                report: "min"
            },
            ie: {
                src: ["source/assets/js/html5shiv.js", "source/assets/js/respond.js"],
                dest: "_site/assets/js/ie.js"
            }
        },

        csslint: {
            src: ["source/assets/css/style.css"]
        },

        jshint: {
            options: {
                jshintrc: ".jshintrc"
            },
            files: {
                src: ["Gruntfile.js", "source/assets/js/plugins.js"]
            }
        },

        validation: {
            options: {
                charset: "utf-8",
                doctype: "HTML5",
                reset: true
            },
            files: {
                src: ["_site/**/*.html"]
            }
        },

        clean: {
            dist: "_site/"
        }

    });

    // Load any grunt plugins found in package.json.
    require("load-grunt-tasks")(grunt, {scope: "devDependencies"});

    grunt.registerTask("build", [
        "clean",
        "jekyll",
        "useminPrepare",
        "concat",
        "copy",
        "cssmin",
        "uglify",
        "uglify:ie",
        "rev",
        "usemin"
    ]);

    grunt.registerTask("default", ["build", "connect", "watch"]);
    grunt.registerTask("test", ["build", "csslint", "jshint", "validation"]);

};
