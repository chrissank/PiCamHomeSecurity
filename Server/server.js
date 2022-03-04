var dgram = require("dgram");

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

var PORT = 6066;
var MULTICAST_ADDR = "255.255.255.255";

async function main() {
    console.clear();

    console.log("Starting PiCamHome Server");

    await delay(100);

    const inquirer = require('inquirer');
    const mpvAPI = require('node-mpv');
    const fs = require('fs')
    const mpv = new mpvAPI({}, ["--no-cache", "--untimed", "--no-demuxer-thread", "--no-border", "--geometry=50%x50%", "--video-rotate=180"]);

    var running = true;

    console.log("Initializing socket connection...");

    await delay(100);

    let socket = true;

    try {
        await updateAddresses();
    } catch(error) {
        socket = false;
    }

    await delay(250);

    if(socket) {
        console.log("Socket broadcast sent. ")
        await delay(100);
    }

    console.log("Loading Cameras...");
    await delay(100);
    console.log("Looking for cameras.json file in directory...");
    await delay(250);

    var cameras = JSON.parse(fs.readFileSync("./cameras.json"))

    console.log("Loaded " + cameras.length + " cameras");
    await delay(300);

    let choices = [];
    for (cam of cameras) {
        choices.push("View Camera " + cam.number);
    }
    choices.push("Add camera");
    choices.push("Exit");

    console.log("PICamHome Started");
    console.log("\n");

    // Main program
    while (running) {

        let action = (await inquirer.prompt({
            prefix: '',
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: choices,
        }, )).action;

        console.log("\n");
        if (action.startsWith("V")) {

            cam = cameras[choices.indexOf(action)];

            try {
                await mpv.start();

                await mpv.load('udp://192.168.0.11:' + cam.port);

                await inquirer.prompt({
                    prefix: '',
                    name: 'action',
                    message: 'To close the stream, hit enter.',
                });

                await mpv.quit();
            } catch (error) {
                console.log(error);
            }

        } else if (action.startsWith("A")) {
            console.log("To add a new camera, edit the cameras.json file. Thanks!");
            await updateAddresses();
        } else {
            console.log("Goodbye!");
            console.log("As a reminder, all cameras will continue running even with this program closed (as long as they are powered on). To reconnect, simply re-open.");
            running = false;
            await delay(7000);
        }

        if(running) {
            console.log("\n");
            await delay(1000);
        }
    }
}

async function updateAddresses() {
    try {
        server = dgram.createSocket({type: "udp4", reuseAdr: true});

        message = new Buffer.alloc(8, "password");

        server.bind(async function() {
            server.setBroadcast(true);
            for(i = 0; i < 10; i++) {
                await server.send(message, 0, message.length, PORT, MULTICAST_ADDR, () => {});
                await delay(100);
            }

            server.close();
        });

    } catch(err) {
        console.log("ERROR:");
        console.log(err);
        console.log("\n");

        console.log("PROGRAM ATTEMPTING TO CONTINUE... IF CAMERAS DO NOT WORK CONTACT HELP");
    }

}

main();
