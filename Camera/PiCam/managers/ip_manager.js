const fs = require("fs").promises;
const {exec} = require("child_process");
const ipFile = "/home/pi/Documents/PiCamHomeSecurityConfig/ip.dat";

module.exports.sync = async function (newAddress) {
    console.log("[IPSYNC] CHECKING IP STATUS");

    let ipIsSame = (await this.getServerIp()) === newAddress;

    if (ipIsSame) {
        console.log("[IPSYNC] ALREADY STREAMING TO THAT ADDRESS. NOT RESTARTING PICAM SERVICE");
    } else {
        console.log("[IPSYNC] UPDATING IP FILE");

        try {
            await fs.writeFile(ipFile, newAddress, function (err) {
                if (err) throw err;
                console.log("[IPSYNC] CREATED NEW IP FILE");
            });
        } catch (err) {
            console.error(err);
        }

        console.log("[IPSYNC] RESTARTING PICAM SERVICE");

        // wait for this command to finish?
        exec("sudo service picam-camera restart", (error, stdout, stderr) => {
            console.log(`${stdout}`);
        });
    }
};

module.exports.getServerIp = async function () {
    var data = "";
    try {
        data = await fs.readFile(ipFile, "utf8");
    } catch (err) {
        console.log(err);
    }
    return data;
};
