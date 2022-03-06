// Detects UDP heartbeats sent by the PiCamHomeSecurity server

console.clear();

var dgram = require("dgram");

var BROADCAST_ADDRESS = "0.0.0.0";
var PORT = 6066;

server = dgram.createSocket({
    type: "udp4",
    reuseAdr: true,
});

server.on("listening", () => {
    var address = server.address();
    console.log(`HEARTBEAT LISTENER CONNECTED: ${address.address}:${address.port}`);
    console.log("\n");
});

server.on("message", (message, info) => {
    if (message + "" === "password") {
        console.log("[HEARTBEAT] DETECTED FROM " + info.address);

        require("./ipsync");
        require("./controller");
    } else {
        console.log("[HEARTBEAT] RECEIVED:\n" + message);
        console.log("[HEARTBEAT] FROM: " + info.address);
    }
    console.log("\n");
});

server.on("error", err => {
    console.log("[HEARTBEAT] ERROR:");
    console.log(`${err.stack}`);
    console.log("\n");
    server.close();
});

server.on("close", err => {
    console.log("[HEARTBEAT] DISCONNECTED:");
    console.log(`${err.stack}`);
    console.log("\n");
});

server.bind(PORT, BROADCAST_ADDRESS, function () {
    server.setBroadcast(true);
});
