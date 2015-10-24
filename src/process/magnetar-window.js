"use strict";

let BrowserWindow = require("browser-window");

module.exports = class MagnetarWindow {
    constructor() {
        this.mainWindow = null;
    }

    open() {
        this.mainWindow = new BrowserWindow({
            height: 800,
            width: 800
        });

        this.mainWindow.on("close", this.onClose);
        this.mainWindow.loadUrl(`file://${__dirname}/../app/index.html`);
    }

    close() {
        this.mainWindow.close();
    }

    onClose() {

    }
};
