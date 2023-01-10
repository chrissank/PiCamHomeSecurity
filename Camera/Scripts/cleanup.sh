#!/bin/bash

search_dir="/home/pi/Documents/PiCamHomeSecurityFootage"

# Find all .h264 files in the directory
for file in "$search_dir"/*.h264; do
  # Check if the file is older than 2 weeks
  if [[ $(stat -c %Y "$file") -lt $(( $(date +%s) - 14*24*60*60 )) ]]; then
    # Delete the file if it is older than 2 weeks
    rm "$file"
  fi
done