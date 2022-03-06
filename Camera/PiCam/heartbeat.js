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
    console.log(`CONNECTED: ${address.address}:${address.port}`);
});

server.on("message", (message, info) => {
    if (message + "" === "password") {
        console.log("PASSWORD RECEIVED FROM " + info.address);

        require("./ipsync");
        require("./controller");
    } else if (message + "" !== "password") {
        console.log("RECEIVED:\n" + message);
        console.log("FROM: " + info.address);
    }
});

server.on("error", err => {
    console.log("ERROR:");
    console.log(`${err.stack}`);
    server.close();
});

server.on("close", err => {
    console.log("DISCONNECTED:");
    console.log(`${err.stack}`);
});

server.bind(PORT, BROADCAST_ADDRESS, function () {
    server.setBroadcast(true);
});
