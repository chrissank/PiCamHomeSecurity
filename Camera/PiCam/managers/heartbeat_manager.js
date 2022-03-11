// Detects UDP heartbeats sent by the PiCamHomeSecurity server

var dgram = require("dgram");
var ip = require("ip");
var HEARTBEAT_PORT = 41000;
var MULTICAST_ADDRESS = "230.100.101.102";
var recent = false;

module.exports.createHeartbeatConnection = function () {
    server = dgram.createSocket({
        type: "udp4",
        reuseAdr: true,
    });

    server.on("listening", async function () {
        server.setBroadcast(true);
        server.setMulticastTTL(128);
        server.addMembership(MULTICAST_ADDRESS, ip.address());
        onListeningStart();
    });
    server.on("message", async function (message, info) {
        await onMessage(message, info);
    });
    server.on("error", onError);
    server.on("close", onClose);

    server.bind(HEARTBEAT_PORT, function () {});
};

// local functions, no need to export them.
async function onListeningStart() {
    var address = server.address();
    console.log(`HEARTBEAT LISTENER CONNECTED: ${address.address}:${address.port}`);
    console.log("\n");
}

async function onMessage(message, info) {
    if (message + "" === "password") {
        if (!recent) {
            recent = true;
            console.log("[HEARTBEAT] DETECTED FROM " + info.address);

            await require("./ip_manager").sync(info.address);
            //await require("./command_manager")();

            setTimeout(() => {
                recent = false;
            }, 5000);
            console.log("\n");
        }
    } else {
        console.log("[HEARTBEAT] RECEIVED:\n" + message);
        console.log("[HEARTBEAT] FROM: " + info.address);
        console.log("\n");
    }
}

function onError(error) {
    console.log("[HEARTBEAT] ERROR:");
    console.log(`${error.stack}`);
    console.log("\n");
    server.close();
}

function onClose(error) {
    console.log("[HEARTBEAT] DISCONNECTED:");
    console.log(`${error.stack}`);
    console.log("\n");
}
