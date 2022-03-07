const inquirer = require("inquirer");

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
    console.clear();
    console.log("Starting PiCamHomeSecurity Server");

    // Add delay between logs so it's more visually appealing
    await delay(100);

    var running = true;

    console.log("Initializing heartbeat connection...");
    await require("./managers/heartbeat_manager").sendHeartbeat();
    console.log("Heartbeats sent");

    var c = await getChoices();

    console.log("PICamHomeSecurity Started");
    console.log("");

    // Main program
    while (running) {
        let action = (
            await inquirer.prompt({
                prefix: "",
                type: "list",
                name: "action",
                message: "What would you like to do?",
                choices: c,
            })
        ).action;

        console.log("");
        if (action.startsWith("V")) {
            cam = (await require("./managers/camera_manager").getCameras())[c.indexOf(action)];

            await require("./managers/mpv_manager").viewCamera(cam);
        } else if (action.startsWith("A")) {
            await require("./managers/camera_manager").addCamera();

            c = await getChoices();
        } else if (action.startsWith("S")) {
            await require("./managers/heartbeat_manager").sendHeartbeat();
        } else {
            console.log("Goodbye!");
            console.log("As a reminder, all cameras will continue running even with this program closed (as long as they are powered on). To reconnect, simply re-open");
            await delay(6000);
            running = false;
        }

        console.log("");
        await delay(1000);
    }
}

async function getChoices() {
    console.log("Loading Cameras...");
    await delay(100);
    console.log("Looking for cameras.json file in the config directory");
    await delay(250);

    var cameras = await require("./managers/camera_manager").getCameras();

    console.log("Loaded " + cameras.length + " cameras from file");
    await delay(300);

    let choices = [];
    for (cam of cameras) {
        let choice = "View ";
        if (cam.title) {
            choice += cam.title + " camera";
        } else {
            choice += "camera" + cam.number;
        }
        choices.push(choice);
    }
    choices.push("Add camera");
    choices.push("Sync IP");
    choices.push("Exit");

    return choices;
}

main();
