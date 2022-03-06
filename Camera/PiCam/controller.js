const {Socket} = require("net");

const client = new Socket();

client.connect(6067, "192.168.0.11", () => {
    console.log("Established TCP connection");

    client.on("data", command => {
        executeAction(command);
    });
});

function executeAction(command) {
    console.log("[SERVER] " + command);
}
