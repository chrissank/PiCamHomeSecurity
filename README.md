# PiCamHomeSecurity

A home security system: with raspberry pi cameras!

![image](https://user-images.githubusercontent.com/5505109/155824662-026c2310-73db-4dbe-9396-25f5bb53cfce.png)

TODO:

-   Per-camera video adjustment e.g. gamma, brightness, etc.
-   Mosaic mode
    -   Tile n number of mpv instances (where n is the number of cameras), each positioned correctly (possibly in a subwindow?), able to refresh
-   'Add camera' functionality
    -   Add to cameras, save to config.json
-   Documentation
    -   How to setup? maybe, idk
-   Better picam_setup.sh
    -   Storage level? higher = keep files for longer, give estimation in days per / 16gb (e.g. can store 3 days per 16 gb, therefore delete if over 1.5 day old or something

FAR TODO:

-   Auto darkness detection
    -   Take photo with raspistill, open with some custom program, average the "brightness" of each pixel, if higher than X value, increase -br option on camera
-   Motion detection
    -   Detection done via server, on each mpv stream (can be captured more than once?)
    -   "log" of events, detections, on the server, viewable on a dashboard
-   Server-centric mode
    -   For low-power or low-storage pi's
    -   Save the stream from MPV onto the server drive as well

Security Features:

-   Move cams, server, onto separate wifi network
-   Disconnect new network from internet
-   Restrict # of connections to the network (only x number of cams, computer, etc.)
