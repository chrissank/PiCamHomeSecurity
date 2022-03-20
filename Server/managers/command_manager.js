//require("./ipsync");

const {Server} = require("net");
var fs = require("fs");

var cameras = await require("./camera_manager").getCameras();

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

module.exports.test = async function () {
    let b = await createTCPConnection(cameras[0]);
    b.write("boom bitch");
};
