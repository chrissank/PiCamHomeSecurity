#!/bin/bash

DOCUMENTS="/home/pi/Documents/"

cd $DOCUMENTS

mkdir PiCamHomeSecurityFootage
mkdir PiCamHomeSecurityConfig

cd PiCamHomeSecurityConfig

read -p "Enter IP of server (or hit enter for default): " ip
echo $ip > ip.dat

if [ "$ip" = "" ]; then
    ip="239.0.0.1"
fi

read -p "Enter your PiCamHomeSecurity Network Password: " pw
echo $pw > password.dat

read -p "Enter the SERVER port you are STREAMING to (e.g. 411XX): " s_port
echo $s_port > stream_port.dat

read -p "Enter the SERVER port you are COMMUNICATING through (e.g. 412XX): " c_port
echo $c_port > communication_port.dat

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

cd ../PiCamHomeSecurity/Camera/PiCam

sudo apt-get install npm

npm install

cd ..

chmod u+x Scripts/picam.sh
chmod u+x Scripts/cleanup.sh
sudo cp Services/picam.service /etc/systemd/system/
sudo cp Services/picam-camera.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable picam.service
sudo systemctl enable picam-camera.service

(crontab -l 2>/dev/null; echo "0 1 * * * /home/pi/Documents/PiCamHomeSecurity/Camera/Scripts/cleanup.sh") | crontab -

echo "Setup complete. Reboot to get started."

#end