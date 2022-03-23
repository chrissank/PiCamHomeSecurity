const fs = require("fs").promises;
const inquirer = require("inquirer");
const configPath = process.cwd() + "/../../PiCamHomeSecurityConfig";
const camerasPath = configPath + "/cameras.json";
const {Form, Input} = require("enquirer");
var cameras;

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

module.exports.getCameras = async function (reload = false) {
    if (reload || cameras === undefined) {
        try {
            cameras = JSON.parse(await fs.readFile(camerasPath));
        } catch (error) {
            console.log("Error countered. PiCamHomeSecurityConfig/cameras.json is missing.");

            // try to create it, if it fails, who cares, we already notified that the file is missing.
            try {
                await fs.mkdir(configPath);
            } catch (error) {}
        }
    }
    return cameras;
};

module.exports.addCamera = async function () {
    let newCamera = await addCameraQuestion.run();
    let cameras = await this.getCameras();

    newCamera.number = cameras.length() + 1;

    cameras.push(newCamera);

    try {
        await fs.writeFile(camerasPath, JSON.stringify(cameras));
    } catch (error) {
        console.log(error);
    }

    console.log("[Camera Manager] Camera added");
};

module.exports.selectCamera = async function () {
    let camChoices = [];

    for (cam of await this.getCameras()) {
        let choice = "";
        if (cam.title) {
            choice += cam.title + " camera";
        } else {
            choice += "Camera" + cam.number;
        }
        camChoices.push(choice);
    }

    camChoices.push("Cancel");

    var choice = (
        await inquirer.prompt({
            prefix: "=>",
            type: "list",
            name: "cam",
            message: "What camera you like to select?",
            choices: camChoices,
        })
    ).cam;

    if (choice === "Cancel") {
        return undefined;
    } else {
        return cameras[camChoices.indexOf(choice)];
    }
};

module.exports.viewCameras = async function () {
    let camera = await this.selectCamera();

    if (camera) {
        await require("./mpv_manager").viewCamera(cam);
    } else {
    }
};
