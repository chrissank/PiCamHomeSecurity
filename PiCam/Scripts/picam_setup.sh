#!/bin/bash

cd PiCam

cd IPSync

node install

cd ..

read -p "Enter IP of server: " ip
read -p "Enter the PORT you are streaming to on the server: " port

sed -i "14s/.*/PORT=\"${port}\"/" Scripts/picam.sh

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