console.clear();

var dgram = require('dgram');
var path = require('path')
var fs = require('fs')
const { exec } = require("child_process");

var MULTICAST_ADDRESS = "239.0.1.2";
var BROADCAST_ADDRESS = "0.0.0.0";
var PORT = 6066;
var recent = false;

server = dgram.createSocket({type: "udp4", reuseAdr: true});

server.on('listening', () => {
    var address = server.address();
    console.log(`CONNECTED: ${address.address}:${address.port}`);
});

server.on('message', (message, info) => {
    console.log("RECEIVED:\n" + message);
    console.log("FROM: " + info.address);

    if((message + "") === "password" && !recent) {
        recent = true; // we only want to update it once within a short amount of time
        console.log("PASSWORD RECEIVED");
        console.log("UPDATING FILE");

        updateFiles(info.address);

        exec("sudo service picam restart", (error, stdout, stderr) => {
            console.log(`stdout: ${stdout}`);
        });

        setTimeout(() => {
            recent = false;
        }, 2000);
    }
});

server.on('error', (err) => {
    console.log("ERROR:");
    console.log(`${err.stack}`);
    server.close();
});

server.on('close', (err) => {
    console.log("DISCONNECTED:");
    console.log(`${err.stack}`);
});

server.bind(PORT, BROADCAST_ADDRESS, function() {
    server.addMembership(MULTICAST_ADDRESS);
    server.setBroadcast(true);
});

function updateFiles(address) {
    const directory = '/home/pi/Documents/PiCamHomeSecurity/PiCam' + path.sep;

    var files = fs.readdirSync(directory).filter(fn => fn.endsWith('-ip'));

    // delete old "ip-<addr>"" file used to identify what IP the camera's should stream to used by the picam.sh script
    try {
        fs.unlinkSync(directory + files[0]);
        //file removed
    } catch(err) {
        console.error(err)
    }

    // create the new "ip-<addr>" file
    try {
        fs.writeFile(directory + address + "-ip", "-", function (err) {
            if (err) throw err;
            console.log('ip file is created successfully.');
        });
    } catch(err) {
        console.error(err)
    }
}
