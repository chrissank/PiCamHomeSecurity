console.clear();

console.log("Starting PiCamHome Server");

const inquirer = require('inquirer');
const mpvAPI = require('node-mpv');
// where you want to initialise the API
const mpv = new mpvAPI({}, ["--no-cache", "--untimed", "--no-demuxer-thread", "--ontop", "--no-border", "--geometry=50%x50%"]);

var running = true;


console.log("Loading Cameras...");

var cameras = [{
    number: 1,
    port: 5000,
    rotation: 0,

}]

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

      if(action.startsWith("V")) {
          console.log("\n");

          cam = cameras[choices.indexOf(action)];
          try {
            await mpv.start()
            await mpv.load('udp://192.168.0.11:' + cam.port);
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
