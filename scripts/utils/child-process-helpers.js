"use strict";

let childProcess = require("child_process");

exports.exec = (command, options, callback) => {
    if (!callback) {
        callback = options;
        options = {};
    }

    if (!options) {
        options = {};
    }

    options.maxBuffer = 1024 * 1024;

    let child = childProcess.exec(command, options, (error, stdout, stderr) => {
        if (error) {
            process.exit(error.code || 1);
        } else {
            callback(null);
        }
    });

    child.stderr.pipe(process.stderr);
    if (!options.ignoreStdout) {
        child.stdout.pipe(process.stdout);
    }
};

exports.spawn = (command, args, options, callback) => {
    if (!callback) {
        callback = options;
        options = {};
    }

    if (!options) {
        options = {};
    }

    let child = childProcess.spawn(command, args, options);
    child.stderr.pipe(process.stderr);
    child.stdout.pipe(process.stdout);
    child.on("error", (error) => {
        console.log("Command \"" + command + "\" failed: " + error.message);
    });
    child.on("exit", (code) => {
        if (code != 0) {
            process.exit(code);
        } else {
            callback(null);
        }
    })
};
