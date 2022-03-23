const dgram = require("dgram");
const ip = require("ip");
const encryption_manager = require("./encryption_manager");

const HEARTBEAT_PORT = 41000;
const MULTICAST_ADDRESS = "230.100.101.102";
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports.sendHeartbeat = async function () {
    socketPromise = new Promise((resolve, reject) => {
        try {
            server = dgram.createSocket({
                type: "udp4",
                reuseAdr: true,
            });

            var msgContents = JSON.stringify(encryption_manager.encrypt("sync"));

            message = new Buffer.alloc(msgContents.length, msgContents);

            server.bind(async function () {
                server.setBroadcast(true);
                server.setMulticastTTL(128);
                server.addMembership(MULTICAST_ADDRESS, ip.address());
                for (i = 0; i < 5; i++) {
                    await server.send(message, 0, message.length, HEARTBEAT_PORT, MULTICAST_ADDRESS, () => {});
                    await delay(200);
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
