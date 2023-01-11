var count = 0;
function createSecurityCam(camera, playlist, security) {
    if (document.getElementById(camera) !== null && playlist !== null && security !== null) {
        videojs.Vhs.xhr.beforeRequest = function (options) {
            options.uri += security;
            return options;
        };
        var player = videojs(camera, { autoplay: 'any', livetracker: true });
        player.src(playlist)
        player.play();

        // keep live
        setInterval(() => {
            if (!player) return;

            if (player && player.paused()) {
                count++;
                if (count > 10) {
                    videojs(camera).dispose();
                    player = null;
                }
                return;
            }

            if (player && isPageHidden()) {
                console.log(camera);
                player.pause();
                return;
            }

            player.liveTracker.seekToLiveEdge();
            console.log("live");
        }, 10000);

    }
}

function isPageHidden() {
    return document.hidden || document.msHidden || document.webkitHidden || document.mozHidden;
}