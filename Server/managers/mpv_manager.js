const mpvAPI = require("node-mpv");
var ip = require("ip");
const inquirer = require("inquirer");

module.exports.viewCamera = async function (cam) {
    try {
        mpv = new mpvAPI({}, ["--no-cache", "--untimed", "--no-demuxer-thread", "--no-border", "--geometry=50%x50%"]);

        await mpv.start();

        if (cam.rotation) {
            await mpv.rotateVideo(cam.rotation);
        }

        await mpv.load(`udp://239.0.0.1:${cam.udpPort}`);

        await inquirer.prompt({
            prefix: "",
            name: "action",
            message: "To close the stream, hit enter.",
        });

        try {
            await mpv.quit();
        } catch (error) {} // who cares if we have an error on closing? it's closed
    } catch (error) {
        console.log(error);
    }
};
