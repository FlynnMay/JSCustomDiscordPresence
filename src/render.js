const electron = require("electron");
const ipc = electron.ipcRenderer;

let detBox = document.getElementById("details");
let stateBox = document.getElementById("state");
let largeIconBox = document.getElementById("largeIcon");
let largeTextBox = document.getElementById("largeText");
let smallIconBox = document.getElementById("smallIcon");
let smallTextBox = document.getElementById("smallText");

let submit = document.getElementById("submit");

submit.addEventListener("click", function () {
  let data = [
    detBox.value,
    stateBox.value,
    largeIconBox.value,
    largeTextBox.value,
    smallIconBox.value,
    smallTextBox.value,
  ];
  ipc.send("pulse-check", data);
});
