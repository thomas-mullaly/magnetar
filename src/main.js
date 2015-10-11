(function (require, process) {
    "use strict";

    let app = require("app");
    let BrowserWindow = require("browser-window");

    require("crash-reporter").start();

    global.magnetar = {
        mainWindow: null
    };

    app.on("window-all-closed", function () {
        if (process.platform != "darwin") {
            app.quit();
        }
    });

    app.on("ready", function () {
        let mainWindow = new BrowserWindow({
            width: 800,
            height: 800
        });

        mainWindow.loadUrl("file://" + __dirname + "/app/index.html");

        mainWindow.openDevTools();

        mainWindow.on("close", function () {
            global.magnetar.mainWindow = null;
        });

        global.magnetar = {
            mainWindow: mainWindow
        };
    });
})(require, process);
