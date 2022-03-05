console.clear();

var dgram = require("dgram");
var path = require("path");
var fs = require("fs");
const {exec} = require("child_process");

var MULTICAST_ADDRESS = "255.255.255.255";
var BROADCAST_ADDRESS = "0.0.0.0";
var PORT = 6066;
var timeSinceUpdate = 0;

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

        console.log("CHECK IF UPDATE NEEDED");
        var isIpTheSame = checkAndUpdateFiles(info.address);

        if (isIpTheSame) {
            console.log("ALREADY STREAMING TO THAT ADDRESS. NOT RESTARTING PICAM SERVICE");
        } else {
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
    server.addMembership(MULTICAST_ADDRESS);
    server.setBroadcast(true);
});

function checkAndUpdateFiles(address) {
    const directory = "/home/pi/Documents/PiCamHomeSecurity/PiCam" + path.sep;

    var files = fs.readdirSync(directory).filter(fn => fn.endsWith("-ip"));

    // delete old "ip-<addr>"" file used to identify what IP the camera's should stream to used by the picam.sh script

    if (!files[0].startsWith(address)) {
        console.log("OLD IP FILE DETECTED");
        try {
            fs.unlinkSync(directory + files[0]);
            console.log("DELETED OLD IP FILE");
            //file removed
        } catch (err) {
            console.error(err);
        }

        // create the new "ip-<addr>" file
        try {
            fs.writeFile(directory + address + "-ip", "-", function (err) {
                if (err) throw err;
                console.log("CREATED NEW IP FILE");
            });
        } catch (err) {
            console.error(err);
        }
        return true;
    } else {
        return false;
    }
}
