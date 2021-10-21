const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipc = electron.ipcMain;
const path = require("path");
var config = require("./data.json");
const fs = require("fs");

// Discord
const RPC = require("discord-rpc");
const { Console } = require("console");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // and load the index.html of the app.
  // mainWindow.loadFile(path.join(__dirname, "index.html"));
  mainWindow.loadURL("file://" + __dirname + "/index.html");

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

// ==========================
// Discord Setup
// ==========================

const rpc = new RPC.Client({
  transport: "ipc",
});

let details = "";
let state = "";
let largeImageKey = "";
let largeImageText = "";
let smallImageKey = "";
let smallImageText = "";
let showElapsedTime = true;

const activity = {
  details: "please leave me alone...",
  state: `Stop watching me`,
  largeImageKey: "gaming",
  largeImageText: "me",
  smallImageKey: "spookyween",
  smallImageText: "spooks",
  buttons: [
    {
      label: "Spooky",
      url: "https://github.com/FlynnMay",
    },
    {
      label: "Listen Along",
      url: "https://www.youtube.com/watch?v=B-LiP1-x65E",
    },
  ],
  startTimestamp: Date.now(),
  instance: true,
};

rpc.on("ready", () => {
  rpc.setActivity(activity);
  console.log("RPC active");
});

rpc.login({
  clientId: config.clientId,
});

// ==========================
// HTML integration
// ==========================

const dialog = electron.dialog;

ipc.on("pulse-check", function (event, args) {
  // dialog.showErrorBox(`${arg}`, "demo of an error message");
  rpc.setActivity();
  let act = {};
  act.details = args[0];
  act.state = args[1];
  act.largeImageKey = args[2];
  act.largeImageText = args[3];
  act.smallImageKey = args[4];
  act.smallImageText = args[5];
  act.buttons = [];
  for (let index = 0; index < parseInt(args[6]); index++) {
    act.buttons[index] = {
      label: args[7 + index * 2],
      url: args[8 + index * 2],
    };
  }
  rpc.setActivity(act);
});
