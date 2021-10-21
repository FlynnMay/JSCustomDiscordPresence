const electron = require("electron");
const ipc = electron.ipcRenderer;

let detBox = document.getElementById("details");
let stateBox = document.getElementById("state");
let largeIconBox = document.getElementById("largeIcon");
let largeTextBox = document.getElementById("largeText");
let smallIconBox = document.getElementById("smallIcon");
let smallTextBox = document.getElementById("smallText");
let buttonCount = document.getElementById("butCount");
let button1Text = document.getElementById("button1Label");
let button2Text = document.getElementById("button2Label");
let button1URL = document.getElementById("button1URL");
let button2URL = document.getElementById("button2URL");
let button1Title = document.getElementById("button1Title");
let button2Title = document.getElementById("button2Title");
let button1URLTitle = document.getElementById("button1URLTitle");
let button2URLTitle = document.getElementById("button2URLTitle");

function updateButtonCount() {
  let count = parseInt(buttonCount.value);
  console.log(count);
  button1Text.hidden = !(count >= 1);
  button1URL.hidden = !(count >= 1);
  button1Title.hidden = !(count >= 1);
  button1URLTitle.hidden = !(count >= 1);

  button2Text.hidden = !(count >= 2);
  button2URL.hidden = !(count >= 2);
  button2Title.hidden = !(count >= 2);
  button2URLTitle.hidden = !(count >= 2);
}

updateButtonCount();

buttonCount.addEventListener("change", updateButtonCount);

let submit = document.getElementById("submit");

submit.addEventListener("click", function () {
  let data = [
    detBox.value, // 0
    stateBox.value, // 1
    largeIconBox.value, // 2
    largeTextBox.value, // 3
    smallIconBox.value, // 4
    smallTextBox.value, // 5
    buttonCount.value, // 6
    button1Text.value, // 7
    button1URL.value, // 8
    button2Text.value, // 9
    button2URL.value, // 10
  ];
  ipc.send("pulse-check", data);
});
