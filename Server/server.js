var dgram = require("dgram");

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

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
        await delay(250);
    } catch(err) {
        console.log("ERROR. AN ERROR HAS OCCURED.");

        console.log("\n");
        console.log(err);
        console.log("\n");

        console.log("PROGRAM ATTEMPTING TO CONTINUE... IF CAMERAS DO NOT WORK CONTACT HELP");

        socket = false;
    }

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
                    message: 'Hit enter to continue',
                });

                await mpv.quit();
            } catch (error) {
                console.log(error);
            }

        } else if (action.startsWith("A")) {
            console.log("To add a new camera, edit the cameras.json file. Thanks!");
        } else {
            console.log("Goodbye!");
            console.log("As a reminder, all cameras will continue running even with this program closed (as long as they are powered on). To reconnect, simply re-open.");
            running = false;
            await delay(7000);
        }

        if(running) {
            console.log("\n");
            await delay(1000);

            try {
                await updateAddresses();
            } catch(err) {
                console.log("ERROR. AN ERROR HAS OCCURED.");

                console.log("\n");
                console.log(err);
                console.log("\n");

                console.log("PROGRAM ATTEMPTING TO CONTINUE... IF CAMERAS DO NOT WORK CONTACT HELP");
            }
        }
    }
}

async function updateAddresses() {
    var socket = dgram.createSocket("udp4");
    socket.bind(function() {
        socket.setBroadcast(true);
    });

    var message = new Buffer.alloc(8, "password");
    socket.send(message, 0, message.length, 5099, '255.255.255.255', function(err, bytes) {
        socket.close();
    });
}

main();