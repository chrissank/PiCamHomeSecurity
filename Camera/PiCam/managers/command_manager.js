const {Socket} = require("net");
const client = new Socket();
const tcpIP = 41200;

module.exports = async function () {
    console.log("[Controller] Attempting to establish TCP connection for commands");

    client.connect(tcpIP, await require("./ip_manager").getServerIp(), () => {
        console.log("[Controller] Established TCP connection");

        client.on("data", command => {
            executeAction(command);
        });
    });

    function executeAction(command) {
        console.log("[Controller] SERVER COMMAND: " + command);
    }
};
