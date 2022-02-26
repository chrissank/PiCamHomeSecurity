#!/bin/bash

cd PiCam

read -p "Enter IP:port of server: " fullip

sed -i "7s/.*/FULLIP=\"${fullip}\"/" picam.sh

chmod u+x picam.sh
sudo cp picam.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable picam.service

echo "Setup complete. Reboot to enable."

#end