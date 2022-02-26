console.clear();

console.log("Starting PiCamHome Server");

const inquirer = require('inquirer');
const mpvAPI = require('node-mpv');
const fs = require('fs')
// where you want to initialise the API
const mpv = new mpvAPI({}, ["--no-cache", "--untimed", "--no-demuxer-thread", "--ontop", "--no-border", "--geometry=50%x50%"]);

var running = true;

console.log("Loading Cameras...");
console.log("Looking for cameras.json file in working directory...");

var cameras = JSON.parse(fs.readFileSync("./cameras.json"))

console.log("Loaded " + cameras.length + " cameras");

let choices = [];
for(cam of cameras) {
    choices.push("View Camera " + cam.number);
}
choices.push("Add camera");
choices.push("Exit");

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

console.log("PICamHome Started");
console.log("\n");
async function main() {
    while(running) {

      let action = (await inquirer.prompt(
        {
          prefix: '',
          type: 'list',
          name: 'action',
          message: 'What would you like to do?',
          choices: choices,
        },
      )).action;

      console.log("\n");
      if(action.startsWith("V")) {

          cam = cameras[choices.indexOf(action)];
          try {
            await mpv.start()
            await mpv.load('udp://192.168.0.11:' + cam.port);


            await inquirer.prompt({
              prefix: '',
              name: 'action',
              message: 'Hit enter to continue',
            })

            await mpv.quit();
            // File is playing!
          } catch (error) {
            console.log(error);
          }

          await delay(1000);
      } else if(action.startsWith("A")) {
        console.log("\n");
        console.log("To add a new camera, edit the code. Thanks!");
        console.log("\n");

        await delay(1000);
      } else {
        running = false;
      }
    }
}

main();
