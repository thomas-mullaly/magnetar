(function () {
    "use strict";

    let fs = require("fs-plus");
    let path = require("path");

    module.exports = (grunt) => {
        grunt.registerTask("build", "Build application", () => {
            let helper = require("./task-helper")(grunt);
            let buildDir = grunt.config.get("magnetar.buildDir");
            let srcDir = grunt.config.get("magnetar.srcDir");
            let distDir = grunt.config.get("magnetar.distDir");
            let appName = grunt.config.get("magnetar.appName");
            let shellAppDir = path.join(distDir, appName);
            let appDir = "";

            if (process.platform === "darwin") {
                appDir = path.join(shellAppDir, "Contents", "Resources", "app");
            }

            if (process.platform === "darwin") {
                fs.copySync("electron/Electron.app", shellAppDir);
                fs.renameSync(path.join(shellAppDir, "Contents", "MacOS", "Electron"),
                    path.join(shellAppDir, "Contents", "MacOS", "Magnetar"));
                fs.renameSync(path.join(shellAppDir, "Contents", "Frameworks", "Electron Helper.app"),
                    path.join(shellAppDir, "Contents", "Frameworks", "Magnetar Helper.app"));
                fs.renameSync(path.join(shellAppDir, "Contents", "Frameworks", "Magnetar Helper.app", "Contents", "MacOS", "Electron Helper"),
                    path.join(shellAppDir, "Contents", "Frameworks", "Magnetar Helper.app", "Contents", "MacOS", "Magnetar Helper"));
            }

            fs.mkdirSync(appDir);
            helper.copy(srcDir, appDir, { filter: /.+\.js$/ });
        });
    };
})();
