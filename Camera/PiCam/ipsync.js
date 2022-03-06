var fs = require("fs");
const {exec} = require("child_process");
const ipFile = "/home/pi/Documents/PiCamHomeSecurityConfig/ip.dat";

console.log("CHECKING IP STATUS");

let ipIsSame = true;
try {
    const data = fs.readFileSync(ipFile, "utf8");
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

    try {
        fs.writeFileSync(ipFile, newAddress, function (err) {
            if (err) throw err;
            console.log("CREATED NEW IP FILE");
        });
    } catch (err) {
        console.error(err);
    }

    console.log("RESTARTING PICAM SERVICE");

    exec("sudo service picam restart", (error, stdout, stderr) => {
        console.log(`${stdout}`);
    });
}
