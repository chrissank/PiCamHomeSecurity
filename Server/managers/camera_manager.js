const fs = require("fs").promises;
const inquirer = require("inquirer");
const configPath = "/home/momserver/Documents/PiCamHomeSecurityConfig";
const camerasPath = configPath + "/cameras.json";
const addCameraQuestions = [
    {
        prefix: "",
        type: "input",
        name: "title",
        message: "What is this camera looking at? (e.g. front yard, driveway) ",
    },
    {
        prefix: "",
        type: "number",
        name: "port",
        message: "What port is the camera streaming to? (e.g. 41100) ",
    },
    {
        prefix: "",
        type: "number",
        name: "tcpPort",
        message: "What port are communications on? (e.g. 41200)",
    },
];

module.exports.getCameras = async function () {
    var cameras = [];
    try {
        cameras = JSON.parse(await fs.readFile(camerasPath));
    } catch (error) {
        console.log("Error countered. PiCamHomeSecurityConfig/cameras.json is missing.");

        // try to create it, if it fails, who cares, we already notified that the file is missing.
        try {
            await fs.mkdir(configPath);
        } catch (error) {}
    }
    return cameras;
};

module.exports.addCamera = async function () {
    let newCamera = await inquirer.prompt(addCameraQuestions);

    let cameras = await this.getCameras();
    cameras.push(newCamera);

    try {
        await fs.writeFile(camerasPath, JSON.stringify(cameras));
    } catch (error) {
        console.log(error);
    }

    console.log("[Camera Manager] Camera added");
};
