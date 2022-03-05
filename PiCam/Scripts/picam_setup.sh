#!/bin/bash

cd ../..

mkdir PiCamHomeSecurityFootage
mkdir PiCamHomeSecurityConfig

cd PiCamHomeSecurityConfig

read -p "Enter IP of server: " ip
echo $ip > ip.dat

read -p "Enter the PORT you are streaming to on the server: " port
echo $port > port.dat

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

CAMERA_SETTINGS="$CAMERA_SETTINGS $HF -rot $rotation"

echo $CAMERA_SETTINGS > camera_settings.dat

NIGHT_SETTINGS="$CAMERA_SETTINGS -br $nightBrightness"

echo $NIGHT_SETTINGS > night_settings.dat

cd ../PiCamHomeSecurity/PiCam/IPSync

npm install

cd ..

chmod u+x Scripts/picam.sh
chmod u+x Scripts/cleanup.sh
sudo cp Services/picam.service /etc/systemd/system/
sudo cp Services/ipsync.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable picam.service
sudo systemctl enable ipsync.service

(crontab -l 2>/dev/null; echo "0 1 * * * /home/pi/Documents/PiCamHomeSecurity/PiCam/Scripts/cleanup.sh") | crontab -

echo "Setup complete. Reboot to get started."

#end