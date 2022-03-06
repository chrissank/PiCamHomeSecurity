//require("./ipsync");

const {Server} = require("net");
var fs = require("fs");

var cameras = [];
try {
    cameras = JSON.parse(fs.readFileSync("../../PiCamHomeSecurityConfig/cameras.json"));
} catch (error) {
    console.log("Error countered. PiCamHomeSecurityConfig/cameras.json is missing.");

    // try to create it, if it fails, who cares, we already notified that the file is missing.
    try {
        fs.mkdirSync("../../PiCamHomeSecurityConfig");
        //fs.writeFileSync(`../../PiCamHomeSecurityConfig/cameras.json`, "[]");
    } catch (error) {}
}

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

async function test() {
    let b = await createTCPConnection(cameras[0]);
    b.write("boom bitch");
}

test();
