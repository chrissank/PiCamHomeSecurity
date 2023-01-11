#!/bin/bash

# Use a small script to determine if the camera should boot in dark or light mode

# Take image
raspistill -w 1920 -h 1080 -o "/home/pi/Documents/PiCamHomeSecurityFootage/brightness.png"

# Average brightness, set mode file
node "/home/pi/Documents/PiCamHomeSecurity/Camera/Scripts/brightness/index.js"

# Wait for script to finish
sleep 3

# Read mode in
MODE=`cat /home/pi/Documents/PiCamHomeSecurityConfig/mode.dat`

# Get the date
NOW=$(date +'%a_%b_%d_%I:%M:%S_%p')

# IPv4 address of the computer to stream to e.g. IP="192.168.0.100", as written in the ip.dat file generated by picam_setup.sh and or PiCam IPSync
IP=`cat /home/pi/Documents/PiCamHomeSecurityConfig/ip.dat`

# Port on the computer to stream to, as written in the stream_port.dat file generated by picam_setup.sh and or PiCam IPSync
PORT=`cat /home/pi/Documents/PiCamHomeSecurityConfig/stream_port.dat`

# Sample video name: picam-06-05T16:07:49.h264
VIDEO_FILE="/home/pi/Documents/PiCamHomeSecurityFootage/footage-$NOW.h264"

# Sample video name: picam-06-05T16:07:49.h264
ENDPOINT=`cat /home/pi/Documents/PiCamHomeSecurityConfig/endpoint.dat`

# Camera specific settings such as rotation, gamma, saturation, etc., as received from the config
ADDITIONAL_SETTINGS=`cat /home/pi/Documents/PiCamHomeSecurityConfig/camera_settings.dat`

if [ "$MODE" = "dark" ]; then
    # Include the night settings since it's dark mode
    NIGHT_SETTINGS=`cat /home/pi/Documents/PiCamHomeSecurityConfig/night_settings.dat`
    ADDITIONAL_SETTINGS="$ADDITIONAL_SETTINGS $NIGHT_SETTINGS"
fi

# raspivid = command to start the video
# -t 0 = sets the video duration to infinite
# -fl = flush buffer after writing (reduce latency)
# -ih = inserts headers for the video
# - o - | tee = sets the output file to two locations, a video file ($VIDEO_FILE) and a stream (ffmpeg -thread_queue_size 4096 ... etc)
# ffmpeg = is a root command of ffmpeg, a video and audio streaming platform
# -thread_queue_size 4096 = increase packet capacity to reduce discarded packets
# -i - = read video from the tee command (which comes from raspivid)
# -f lavfi -i anullsrc = sets audio to silence
# -c:v copy = skip re-encoding the h264 stream, just copy it
# -f h264 = set output format to h264
# rtmp://$IP:PORT = output URL for the rtmp stream
# SOMETIMES:
#    - vf, hf = vertical or horizontal flip
#    - rot = rotation (0-360deg)
#    - br = brightness (0-100, for night viewing)

if nc -z $IP $PORT; then
    echo "Running with streaming"
    raspivid -t 0 -w 1920 -h 1080 -a 12 -fps 30 -b 5000000 $ADDITIONAL_SETTINGS -ih -g 90 -o - | tee $VIDEO_FILE | ffmpeg -thread_queue_size 4096 -i - -f lavfi -i anullsrc -c:v copy -f flv rtmp://$IP:$PORT$ENDPOINT
else
    echo "Running without streaming"
    raspivid -t 0 -w 1920 -h 1080 -a 12 -fps 30 -b 5000000 $ADDITIONAL_SETTINGS -ih -g 90 -o $VIDEO_FILE 
fi

