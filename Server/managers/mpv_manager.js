const mpvAPI = require("node-mpv");
var ip = require("ip");
const inquirer = require("inquirer");

// global settings for all videos
const mpv = new mpvAPI({}, ["--no-cache", "--untimed", "--no-demuxer-thread", "--no-border", "--geometry=50%x50%"]);

module.exports.viewCamera = async function (cam) {
    try {
        await mpv.start();

        if (cam.rotation) {
            await mpv.rotateVideo(cam.rotation);
        }

        await mpv.load(`udp://${ip.address()}:${cam.udpPort}`);

        await inquirer.prompt({
            prefix: "",
            name: "action",
            message: "To close the stream, hit enter. Please, do not close the stream with the program",
        });

        await mpv.quit();
    } catch (error) {
        console.log(error);
    }
};
