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
        },
        app: {
            src: ["app/*.ts", "!app/typings/*.ts"],
            outDir: compileDir,
            tsconfig: path.join(srcDir, "app"),
            options: {
                sourceRoot: srcDir,
                sourceMap: true
            }
        }
    };

    let tsdConfig = {
        app: {
            options: {
                command: "reinstall",
                latest: true,
                overwrite: true,
                config: path.join(srcDir, "app", "tsd.json")
            }
        }
    };

    grunt.initConfig({
        pkg: packageJson,
        clean: [buildDir],
        copy: copyConfig,
        electron: electronConfig,
        "download-electron": downloadElectronConfig,
        ts: typescriptConfig,
        tsd: tsdConfig,
        magnetar: {
            srcDir: srcDir,
            buildDir: buildDir,
            distDir: distDir,
            appName: appName
        }
    });

    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-electron-installer");
    grunt.loadNpmTasks("grunt-electron");
    grunt.loadNpmTasks("grunt-download-electron");
    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks("grunt-tsd");

    grunt.registerTask("bootstrap", ["tsd"]);
    grunt.registerTask("copy-resources", ["copy:bower", "copy:electronPackage", "copy:html"])
    grunt.registerTask("compile", ["clean", "ts:process", "ts:app", "copy-resources"]);
    grunt.registerTask("default", ["bootstrap", "download-electron", "compile"]);
    grunt.registerTask("package", ["bootstrap", "compile", "electron"]);
};
