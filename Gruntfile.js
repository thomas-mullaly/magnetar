module.exports = function (grunt) {
    "use strict";
    const srcDir = "src";
    const appDir = `${srcDir}/app`;
    const bowerComponentsDir = `${appDir}/bower_components`;
    const buildDir = "build";
    const distDir = `${buildDir}/dist`;
    const distSrcDir = `${distDir}/src`;
    const distAppDir = `${distSrcDir}/app`;
    const distBowerComponents = `${distAppDir}/bower_components`;

    let copyConfig = {
        bower: {
            files: [{
                expand: true,
                cwd: bowerComponentsDir,
                src: ["**"],
                dest: distBowerComponents
            }]
        },
        electronPackage: {
            files: [{
                expand: true,
                src: ["package.json"],
                dest: `${distDir}`
            }]
        },
        html: {
            files: [{
                expand: true,
                cwd: appDir,
                src: ["**/*.html", "!bower_components/**/*.html"],
                dest: distAppDir
            }]
        }
    };

    let babelConfig = {
        options: {
            sourceMap: true
        },
        dist: {
            files: [{
                expand: true,
                cwd: srcDir,
                src: ["**/*.js", "!app/bower_components/**/*.js"],
                dest: distSrcDir,
                ext: ".js"
            }]
        }
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        clean: [buildDir],
        babel: babelConfig,
        copy: copyConfig
    });

    grunt.loadNpmTasks("grunt-babel");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-copy");

    grunt.registerTask("default", ["clean", "babel", "copy:bower", "copy:electronPackage", "copy:html"]);
};
