const fs = require("fs");
const inkjet = require("inkjet");

const modeFile = "/home/pi/Documents/PiCamHomeSecurityConfig/mode.dat";
const brightnessImage = "/home/pi/Documents/PiCamHomeSecurityFootage/brightness.png";

inkjet.decode(fs.readFileSync(brightnessImage), function (err, decoded) {
    var n = 0;
    var total = 0;
    var i = 0;
    while (i < decoded.data.length) {
        var r = parseInt(decoded.data[i++]);
        var g = parseInt(decoded.data[i++]);
        var b = parseInt(decoded.data[i++]);
        total += 0.2126 * r + 0.7152 * g + 0.0722 * b;
        i++;
        n++;
    }
    var brightness = total / n;

    if (brightness < 25) {
        fs.writeFile(modeFile, "dark", function (err) {
            if (err) throw err;
            console.log("[BRIGHTNESS MANAGER] DARK MODE FILE WRITTEN");
        });
    } else {
        fs.writeFile(modeFile, "light", function (err) {
            if (err) throw err;
            console.log("[BRIGHTNESS MANAGER] LIGHT MODE FILE WRITTEN");
        });
    }
});
