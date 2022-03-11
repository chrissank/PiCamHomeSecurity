const fs = require("fs").promises;
const inquirer = require("inquirer");
const configPath = process.cwd() + "/../../../PiCamHomeSecurityConfig";
const camerasPath = configPath + "/cameras.json";
const {Form, Input} = require("enquirer");

const addCameraQuestion = new Form({
    name: "camera",
    message: "Please fill in the camera details below:",
    choices: [
        {name: "title", message: "Where does this camera view? (e.g. Front yard, back yard)", initial: ""},
        {name: "udpPort", message: "What port does this camera stream to? (typically 411XX, e.g. 41100)", initial: ""},
        {name: "tcpPort", message: "What port does this camera communicate on? (typically 412XX, e.g. 41200)", initial: ""},
    ],
    prefix: state => "=>",
});

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
    let newCamera = await addCameraQuestion.run();

    let cameras = await this.getCameras();
    cameras.push(newCamera);

    try {
        await fs.writeFile(camerasPath, JSON.stringify(cameras));
    } catch (error) {
        console.log(error);
    }

    console.log("[Camera Manager] Camera added");
};
