var dgram = require("dgram");

var HEARTBEAT_PORT = 41000;
var MULTICAST_ADDR = "255.255.255.255";
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports.sendHeartbeat = async function () {
    socketPromise = new Promise((resolve, reject) => {
        try {
            server = dgram.createSocket({
                type: "udp4",
                reuseAdr: true,
            });

            message = new Buffer.alloc(8, "password");

            server.bind(async function () {
                server.setBroadcast(true);
                for (i = 0; i < 5; i++) {
                    await server.send(message, 0, message.length, HEARTBEAT_PORT, MULTICAST_ADDR, () => {});
                    await delay(100);
                }
                server.close();
                resolve(); // resolve the promise once each packet is sent
            });
        } catch (err) {
            console.log("ERROR:");
            console.log(err);
            console.log("\n");

            console.log("PROGRAM ATTEMPTING TO CONTINUE... RESTART. IF CAMERAS CONTINUE TO NOT WORK, CONTACT HELP");
            reject(err);
        }
    });
    return socketPromise;
};
