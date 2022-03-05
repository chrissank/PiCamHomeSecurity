#!/bin/bash

cd ../..

mkdir PiCamFootage

cd PiCamHomeSecurity/PiCam/IPSync

npm install

cd ..

read -p "Enter IP of server: " ip
read -p "Enter the PORT you are streaming to on the server: " port
read -p "Vertical flip? (y/n) " vflip
read -p "Horizontal flip? (y/n) " hflip
read -p "Rotation? (deg) " rotation

VF=""
HF=""
ROT=""
if [ "$vflip" = "y" ]; then
    VF="-vf"
fi

ADDITIONAL_SETTINGS="$VF"

if [ "$hflip" = "y" ]; then
    HF="-hf"
fi

ADDITIONAL_SETTINGS="$ADDITIONAL_SETTINGS $HF -rot $rotation"

echo $ADDITIONAL_SETTINGS

sed -i "16s/.*/PORT=\"${port}\"/" Scripts/picam.sh

sed -i "21s/.*/ADDITIONAL_SETTINGS=\"${ADDITIONAL_SETTINGS}\"/" Scripts/picam.sh

chmod u+x Scripts/picam.sh
chmod u+x Scripts/cleanup.sh
sudo cp Services/picam.service /etc/systemd/system/
sudo cp Services/ipsync.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable picam.service
sudo systemctl enable ipsync.service

(crontab -l 2>/dev/null; echo "0 1 * * * /home/pi/Documents/PiCamHomeSecurity/PiCam/Scripts/cleanup.sh") | crontab -

echo "Setup complete. Reboot to enable."

#end