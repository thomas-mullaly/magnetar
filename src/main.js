"use strict";

let MagnetarApp = require("./process/magnetar-app");
let app = require("app");

(() => {
    app.on("ready", () => {
        MagnetarApp.start();
    });
})();
