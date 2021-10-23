const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipc = electron.ipcMain;
const path = require("path");

const storage = require("electron-json-storage");

// Discord
const RPC = require("discord-rpc");
const { Console } = require("console");

const dataPath = storage.getDataPath();

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

function RPCLogin() {
  storage.has("data", function (error, hasKey) {
    if (error) throw error;

    if (!hasKey) {
      storage.set("data", { clientId: "ID" });

      dialog.showErrorBox(
        `Client ID not found`,
        `To use this app go to: ${dataPath}\\data.json and fill in your discord application client ID`
      );
    }
  });

  let id = "";
  storage.get("data", function (error, data) {
    if (error) throw error;

    if (data.clientId == "ID") {
      dialog.showErrorBox(
        `Client ID not found`,
        `To use this app go to: ${dataPath}\\data.json and fill in your discord application client ID`
      );
    }
    rpc.login({
      clientId: data.clientId,
    });
  });
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    // autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      // devTools: false,
    },
  });

  // and load the index.html of the app.
  // mainWindow.loadFile(path.join(__dirname, "index.html"));
  mainWindow.loadURL("file://" + __dirname + "/index.html");
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", function () {
  createWindow();
  RPCLogin();
});

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

// ==========================
// HTML integration
// ==========================

ipc.on("pulse-check", function (event, args) {
  rpc.setActivity();
  let act = {};
  act.details = args[0];
  act.state = args[1];
  act.largeImageKey = args[2];
  act.largeImageText = args[3];
  act.smallImageKey = args[4];
  act.smallImageText = args[5];
  let count = parseInt(args[6]);
  if (count > 0) act.buttons = [];
  for (let index = 0; index < count; index++) {
    act.buttons[index] = {
      label: args[7 + index * 2],
      url: args[8 + index * 2],
    };
  }
  rpc.setActivity(act);
});

ipc.on("save", function (event, args) {
  let _buttons;

  let count = parseInt(args[6]);
  if (count > 0) _buttons = [];
  for (let index = 0; index < count; index++) {
    _buttons[index] = {
      label: args[7 + index * 2],
      url: args[8 + index * 2],
    };
  }

  let saveInfo = {
    details: args[0],
    state: args[1],
    largeImageKey: args[2],
    largeImageText: args[3],
    smallImageKey: args[4],
    smallImageText: args[5],
    buttons: _buttons,
  };
  storage.set("saves", saveInfo);
});

ipc.on("load", function (event) {
  storage.get("saves", function (error, data) {
    if (error) throw error;

    rpc.setActivity(data);
  });
});

class SaveInfo {
  details;
  state;
  largeImageKey;
  largeImageText;
  smallImageKey;
  smallImageText;
  buttons;
}
