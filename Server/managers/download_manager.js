const fs = require("fs").promises;
const inquirer = require("inquirer");
const camera_manager = require("./camera_manager");
const command_manager = require("./command_manager");

module.exports.downloadFile = async function () {
    let camera = await camera_manager.selectCamera();

    let date = (
        await inquirer.prompt({
            prefix: "=>",
            type: "input",
            name: "action",
            message: "What day of the month do you want to download footage from?",
        })
    ).action;

    let time = (
        await inquirer.prompt({
            prefix: "=>",
            type: "input",
            name: "action",
            message: "What time would you like to download (format: HH:mm:SS 24-hour format e.g. 4pm = 14:00)?",
        })
    ).action;

    await command_manager.sendCommand(camera, "test");
};
