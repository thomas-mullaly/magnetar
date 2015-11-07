"use strict";

let path = require("path");

module.exports = (grunt) => {
    let homeDir = "";

    if (process.platform === "darwin" || process.platform === "linux") {
        homeDir = process.env.HOME;
    }

    grunt.file.setBase(path.resolve("."));

    let packageJson = grunt.file.readJSON("package.json");

    let appName = packageJson.name;

    if (process.platform === "darwin") {
        appName += ".app";
    }

    const srcDir = path.resolve("src");
    const srcAppDir = path.join(srcDir, "app");
    const srcBowerComponentsDir = path.join(srcAppDir, "bower_components");
    const buildDir = path.resolve("build");
    const compileDir = path.join(buildDir, "compile");
    const compileSrcDir = path.join(compileDir, "src");
    const compileAppDir = path.join(compileSrcDir, "app");
    const compileBowerComponentsDir = path.join(compileAppDir, "bower_components");
    const distDir = `${buildDir}/dist`;
    const distSrcDir = `${distDir}/src`;
    const distAppDir = `${distSrcDir}/app`;
    const distBowerComponents = `${distAppDir}/bower_components`;
    const electronDownloadDir = path.resolve("electron");

    let copyConfig = {
        bower: {
            files: [{
                expand: true,
                cwd: srcBowerComponentsDir,
                src: ["**"],
                dest: compileBowerComponentsDir
            }]
        },
        electronPackage: {
            files: [{
                expand: true,
                src: ["package.json"],
                dest: compileDir
            }]
        },
        html: {
            files: [{
                expand: true,
                cwd: srcAppDir,
                src: ["**/*.html", "!bower_components/**/*.html"],
                dest: compileAppDir
            }]
        },
        processJs: {
            files: [{
                expand: true,
                cwd: srcDir,
                src: ["**/*.js", "!app/**/*.js"],
                dest: compileSrcDir
            }]
        }
    };

    let electronConfig = {
        osxBuild: {
            options: {
                name: packageJson.name,
                dir: compileDir,
                out: distDir,
                version: packageJson.electronVersion,
                platform: "darwin",
                arch: "x64",
                asar: true,
                "app-bundle-id": "com.tmullaly.magnetar",
                "app-version": packageJson.version,
                "helper-bundle-id": "com.tmullaly.magnetar.helper"
            }
        },
        windows: {
            options: {
                name: packageJson.name,
                dir: compileDir,
                out: distDir,
                version: packageJson.electronVersion,
                platform: "win32",
                arch: "x64",
                asar: true
            }
        }
    };

    let babelConfig = {
        options: {
            sourceMap: true,
            blacklist: ["strict"],
            modules: "amd"
        },
        dist: {
            files: [{
                expand: true,
                cwd: srcDir,
                src: ["app/*.js", "!app/bower_components/**/*.js"],
                dest: compileSrcDir,
                ext: ".js"
            }]
        }
    };

    let downloadElectronConfig = {
        version: packageJson.electronVersion,
        outputDir: electronDownloadDir
    };

    let typescriptConfig = {
        process: {
            src: ["process/*.ts", "!process/typings/*.ts"],
            outDir: compileDir,
            tsconfig: path.join(srcDir, "process"),
            options: {
                sourceMap: true,
                sourceRoot: srcDir
            }
        }
    }
    grunt.initConfig({
        pkg: packageJson,
        clean: [buildDir],
        babel: babelConfig,
        copy: copyConfig,
        electron: electronConfig,
        "download-electron": downloadElectronConfig,
        ts: typescriptConfig,
        magnetar: {
            srcDir: srcDir,
            buildDir: buildDir,
            distDir: distDir,
            appName: appName
        }
    });

    grunt.loadNpmTasks("grunt-babel");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-electron-installer");
    grunt.loadNpmTasks("grunt-electron");
    grunt.loadNpmTasks("grunt-download-electron");
    grunt.loadNpmTasks("grunt-ts");

    grunt.registerTask("compile", ["clean", "babel", "ts:process", "copy:bower", "copy:electronPackage", "copy:html", "copy:processJs"]);
    grunt.registerTask("default", ["download-electron", "compile"]);
    grunt.registerTask("package", ["compile", "electron"]);
};
