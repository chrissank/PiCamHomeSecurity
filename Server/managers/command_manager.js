const {Server} = require("net");
const fs = require("fs");
const encryption_manager = require("./encryption_manager");

// Creates and manages a TCP connection.
function createTCPConnection(camera) {
    socketPromise = new Promise((resolve, reject) => {
        try {
            const server = new Server(socket => {
                socket.on("data", message => {
                    console.log(`CAM${camera.number}: ${message}`);
                });

                socket.on("close", hadError => {
                    console.log(`CAM${camera.number}: DISCONNECTED. HADERROR=${hadError}`);

                    server.close();
                });
            });

            server.on("connection", socket => {
                console.log(`CAM${camera.number}: CONNECTED`);
                resolve(socket);
            });

            server.on("close", () => {
                console.log(`CAM${camera.number}: SERVER STOPPED`);
            });

            server.listen(camera.tcpPort, () => console.log(`CAM${camera.number}: SERVER STARTED`));
        } catch (err) {
            reject(err);
        }
    });

    return socketPromise;
}

module.exports.sendCommand = async function (camera, command) {
    let conn = await createTCPConnection(camera);
    conn.write(encryption_manager.encrypt(command));
};
