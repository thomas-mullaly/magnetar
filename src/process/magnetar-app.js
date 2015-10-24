"use strict";

let app = require("app");
let MagnetarWindow = require("./magnetar-window");

module.exports = class MagnetarApp {
    constructor() {
        this.mainWindow = null;
    }

    openWindow() {
        this.mainWindow = new MagnetarWindow();
        this.mainWindow.open();
    }

    static start() {
        var magnetarApp = new MagnetarApp();
        magnetarApp.openWindow();
    }
};
