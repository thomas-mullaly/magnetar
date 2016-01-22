import app = require("app");
import {MagnetarWindow} from "./magnetar-window";

export class MagnetarApp {
    mainWindow: MagnetarWindow;
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
