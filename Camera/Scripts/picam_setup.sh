#!/bin/bash

DOCUMENTS="/home/pi/Documents/"

cd $DOCUMENTS

mkdir PiCamHomeSecurityFootage
mkdir PiCamHomeSecurityConfig

cd PiCamHomeSecurityConfig

read -p "Enter IP of server (or hit enter for default): " ip
echo $ip > ip.dat

read -p "Enter the SERVER port you are STREAMING to (e.g. 411XX): " s_port
echo $s_port > stream_port.dat

read -p "Enter the SERVER endpoint you are STREAMING to (e.g. /stream/name): " endpoint
echo $endpoint > endpoint.dat

read -p "Vertical flip? (y/n) " wantVFlip
read -p "Horizontal flip? (y/n) " wantHFlip
read -p "Rotation? (deg) " rotation
read -p "Turn brightness up at night? (y/n) " wantNightBright

if [ "$wantNightBright" = "y" ]; then
    read -p "Brightness 0-100% (60 recommended): " nightBrightness
fi

CAMERA_SETTINGS=""

if [ "$wantVFlip" = "y" ]; then
    CAMERA_SETTINGS="$CAMERA_SETTINGS -vf"
fi

if [ "$wantHFlip" = "y" ]; then
    CAMERA_SETTINGS="$CAMERA_SETTINGS -hf"
fi

if [ "$rotation" = "" ]; then
    rotation="0"
fi

CAMERA_SETTINGS="$CAMERA_SETTINGS $HF -rot $rotation"

echo $CAMERA_SETTINGS > camera_settings.dat

NIGHT_SETTINGS="-br $nightBrightness"

echo $NIGHT_SETTINGS > night_settings.dat

cd ../PiCamHomeSecurity/Camera/

sudo apt-get install npm
sudo apt-get install netcat

cd Scripts/brightness

npm install

cd ../..

chmod u+x Scripts/picam.sh
chmod u+x Scripts/cleanup.sh
sudo cp Services/picam-camera.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable picam-camera.service

(crontab -l 2>/dev/null; echo "0 1 * * * /home/pi/Documents/PiCamHomeSecurity/Camera/Scripts/cleanup.sh") | crontab -

echo "Setup complete. Reboot to get started."

#end