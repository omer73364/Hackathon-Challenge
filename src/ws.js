const Websocket = require("ws");

const wss = new Websocket.Server({ port: 8081 });

wss.on("connection", (ws) => {
  console.log("One client connected");
});

wss.on("error", (error) => {
  console.error("WebSocket server error:", error);
});

wss.on("close", () => {
  console.log("WebSocket server closed");
});

console.log("WebSocket server started on port 8081");

module.exports = wss ;