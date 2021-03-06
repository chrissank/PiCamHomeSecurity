const crypto = require("crypto");
const fs = require("fs");
const passwordFile = "/home/pi/Documents/PiCamHomeSecurityConfig/password.dat";

var password = "";
try {
    password = fs.readFileSync(passwordFile, "utf8");
} catch (err) {}

if (password === "") {
    console.log("");
    console.log("[ENC] No password file found. Using default password.");
    console.log("");
    password = "password";
}

let key = Buffer.alloc(32, password + "Pm6IQ6wfkSWgsoWjNa1XAJWxxwg9Z6CT"); // pad the password with extra incase its too short

/* Taken from https://www.tutorialspoint.com/encrypt-and-decrypt-data-in-nodejs */

//Encrypting text
module.exports.encrypt = function (text) {
    const iv = crypto.randomBytes(16);
    let cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return {iv: iv.toString("hex"), encryptedData: encrypted.toString("hex")};
};

// Decrypting text
module.exports.decrypt = function (text) {
    let iv = Buffer.from(text.iv, "hex");
    let encryptedText = Buffer.from(text.encryptedData, "hex");
    let decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
    decipher.setAutoPadding(false);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
};
