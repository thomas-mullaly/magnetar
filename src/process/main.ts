/// <reference path="typings/github-electron/github-electron.d.ts" />
/// <reference path="typings/node/node.d.ts" />

import {MagnetarApp} from "./magnetar-app";
import app = require("app");

app.on("ready", () => {
    MagnetarApp.start();
});
