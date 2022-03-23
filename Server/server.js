const inquirer = require("inquirer");

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
    console.clear();
    console.log("Starting PiCamHomeSecurity Server");
    var running = true;

    // Add delay between logs so it's more visually appealing
    await delay(100);

    console.log("Checking for password...");
    await require("./managers/encryption_manager").initialize();
    console.log("Password setup");

    await delay(100);

    console.log("Initializing heartbeat connection...");
    await require("./managers/heartbeat_manager").sendHeartbeat();
    console.log("Heartbeats sent");

    var options = [];

    options.push("View camera");
    options.push("Download footage");
    options.push("Edit cameras");
    options.push("Sync IP");
    options.push("Exit");

    console.log("PiCamHomeSecurity Started");
    console.log("");

    // Main program
    while (running) {
        let action = (
            await inquirer.prompt({
                prefix: "=>",
                type: "list",
                name: "action",
                message: "What would you like to do?",
                choices: options,
            })
        ).action;

        console.log("");
        if (action.startsWith("View")) {
            await require("./managers/camera_manager").viewCameras();
        } else if (action.startsWith("And")) {
            await require("./managers/camera_manager").addCamera();
        } else if (action.startsWith("Download")) {
            await require("./managers/download_manager").downloadFile();
        } else if (action.startsWith("Sync")) {
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

main();
