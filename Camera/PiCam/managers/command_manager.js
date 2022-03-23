const {Socket} = require("net");
const encryption_manager = require("./encryption_manager");

const client = new Socket();
const tcpIP = 41200;

module.exports = async function () {
    console.log("[COMMANDS] Attempting to establish TCP connection for commands");

    client.connect(tcpIP, await require("./ip_manager").getServerIp(), () => {
        console.log("[COMMANDS] Established TCP connection");

        client.on("data", command => {
            executeAction(encryption_manager.decrypt(command));
        });
    });

    function executeAction(command) {
        console.log("[COMMANDS] SERVER COMMAND: " + command);
    }
};
