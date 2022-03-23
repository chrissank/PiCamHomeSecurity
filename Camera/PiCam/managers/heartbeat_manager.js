const dgram = require("dgram");
const ip = require("ip");
const encryption_manager = require("./encryption_manager");

const HEARTBEAT_PORT = 41000;
const MULTICAST_ADDRESS = "230.100.101.102";
var recent = false;

module.exports.createHeartbeatConnection = function () {
    server = dgram.createSocket({
        type: "udp4",
        reuseAdr: true,
    });

    server.on("listening", onListeningStart);
    server.on("message", async function (message, info) {
        await onMessage(encryption_manager.decrypt(JSON.parse(message)), info);
    });
    server.on("error", onError);
    server.on("close", onClose);

    server.bind(HEARTBEAT_PORT, function () {
        server.setBroadcast(true);
        server.setMulticastTTL(128);
        server.addMembership(MULTICAST_ADDRESS, ip.address());
    });
};

// local functions, no need to export them.
async function onListeningStart() {
    const address = server.address();
    console.log(`[HEARTBEAT] LISTENER CONNECTED: ${address.address}:${address.port}`);
    console.log("\n");
}

async function onMessage(message, info) {
    if (message.startsWith("sync")) {
        if (!recent) {
            recent = true;
            console.log("[HEARTBEAT] DETECTED FROM " + info.address);

            await require("./ip_manager").sync(info.address);
            await require("./command_manager")(); // attempts to establish a TCP connection

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
