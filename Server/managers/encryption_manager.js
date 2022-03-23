const crypto = require("crypto");
const fs = require("fs");
const inquirer = require("inquirer");
const passwordFile = process.cwd() + "/../../PiCamHomeSecurityConfig/password.dat";

var key = "";
try {
    key = fs.readFileSync(passwordFile, "utf8");
} catch (err) {}

/* Taken from https://www.tutorialspoint.com/encrypt-and-decrypt-data-in-nodejs */

//Encrypting text
module.exports.encrypt = function (text) {
    const iv = crypto.randomBytes(16);
    let cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return {iv: iv.toString("hex"), encryptedData: encrypted.toString("hex")};
};

// Decrypting text
module.exports.decrypt = function (text) {
    let iv = Buffer.from(text.iv, "hex");
    let encryptedText = Buffer.from(text.encryptedData, "hex");
    let decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
};

module.exports.initialize = async function () {
    if (key === "") {
        console.log("");
        console.log("No password file found.");
        console.log("Please enter your password below. If this is the first time, please generate a password. Once selected, you cannot change your password.");
        console.log(
            "You must use the same password on ALL cameras. Please use the password you entered on any already setup cameras, or you will need to update each camera's password."
        );

        key = (
            await inquirer.prompt({
                prefix: "=>",
                type: "input",
                name: "password",
                message: "Please enter your password: ",
            })
        ).password;

        try {
            fs.writeFileSync(passwordFile, key);
        } catch (error) {
            console.log(error);
        }

        console.log("Password set: " + key);
    } else {
    }
};
