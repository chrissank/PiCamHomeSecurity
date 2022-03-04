#!/bin/bash

cd PiCam

read -p "Enter IP of server: " ip
read -p "Enter the PORT you are streaming to on the server: " port

sed -i "14s/.*/PORT=\"${port}\"/" picam.sh

chmod u+x picam.sh
chmod u+x cleanup.sh
sudo cp picam.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable picam.service

echo "Setup complete. Reboot to enable."

(crontab -l 2>/dev/null; echo "0 1 * * * /home/pi/Documents/PiCamHome/PiCam/cleanup.sh") | crontab -

#end