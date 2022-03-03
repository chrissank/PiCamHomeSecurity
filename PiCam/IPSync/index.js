var dgram = require("dgram");
var server = dgram.createSocket("udp4");
const fs = require('fs');
const path = require('path');

server.on("error", function(err) {
    console.log("ERROR:" + err.stack);
    server.close();
});

server.on("message", function(msg, rinfo) {
    console.log("RECEIVED:\n\n" + msg + "\n");
    console.log("FROM: " + rinfo.address);


    if((msg + "") === "password") {
        console.log("PASSWORD RECEIVED");
        console.log("UPDATING FILE");

        updateFiles(rinfo.address);

        // stop service

        const { exec } = require("child_process");

        exec("ping wwww.google.ca", (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
        });

        // start service
    }
});

server.on("listening", function() {
    var address = server.address();
    console.log("CONNECTED: " +
        address.address + ":" + address.port);
});

server.bind(5099);

function updateFiles(address) {
    const directory = 'D:/PiCamHome/PiCam' + path.sep;

    var files = fs.readdirSync(directory).filter(fn => fn.startsWith('ip-'));

    // delete old "ip-<addr>"" file used to identify what IP the camera's should stream to used by the picam.sh script
    try {
        fs.unlinkSync(directory + files[0]);
        //file removed
    } catch(err) {
        console.error(err)
    }

    // create the new "ip-<addr>" file
    try {
        fs.writeFile(directory + "ip-" + address, "-", function (err) {
            if (err) throw err;
            console.log('ip<addr> file is created successfully.');
        });
    } catch(err) {
        console.error(err)
    }
}