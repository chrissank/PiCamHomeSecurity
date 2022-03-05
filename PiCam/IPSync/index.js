console.clear();

var dgram = require("dgram");
var fs = require("fs");
const {exec} = require("child_process");

var BROADCAST_ADDRESS = "0.0.0.0";
var PORT = 6066;
const configDirectory = "/home/pi/Documents/PiCamHomeSecurityConfig";

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

        let ipIsSame = true;
        try {
            const data = fs.readFileSync(`${configDirectory}/ip.dat`, "utf8");
            if (data !== info.address) {
                ipIsSame = false;
            }
        } catch (err) {
            ipIsSame = false;
        }

        if (ipIsSame) {
            console.log("ALREADY STREAMING TO THAT ADDRESS. NOT RESTARTING PICAM SERVICE");
        } else {
            console.log("UPDATING IP FILE");
            updateIpFile(info.address);

            console.log("RESTARTING PICAM SERVICE");

            exec("sudo service picam restart", (error, stdout, stderr) => {
                console.log(`${stdout}`);
            });
        }
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

function updateIpFile(newAddress) {
    try {
        fs.writeFileSync(`${configDirectory}/ip.dat`, newAddress, function (err) {
            if (err) throw err;
            console.log("CREATED NEW IP FILE");
        });
    } catch (err) {
        console.error(err);
    }
}
