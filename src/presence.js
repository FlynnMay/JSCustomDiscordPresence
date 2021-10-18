const RPC = require("discord-rpc");
const rpc = new RPC.Client({
  transport: "ipc",
});

const activity = {
  details: "please leave me alone",
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
  clientId: "898065817265123348",
});
