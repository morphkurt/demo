var config = {
    "key": "a3b4a6a3-37e5-4e9f-b275-fcf8b9c4d7c9"
}
var source = {
    dash: 'https://bitmovin-a.akamaihd.net/content/art-of-motion_drm/mpds/11331.mpd',
    drm: {
      widevine: {
        LA_URL: 'https://widevine-proxy.appspot.com/proxy'
      }
    }
  };

var container = document.getElementById('my-player');
var player = new bitmovin.player.Player(container, config);


player.getSupportedDRM().then(function(drm){
 
    log(getDRM(drm))
})

function getDRM(drm){
    switch (drm) {
      case drm.contains(widevine):
        return 'widevine';
      case drm.contains(fairplay):
        return 'fairplay';
      case drm.contains(playready):
        return 'playready'
      default:
        return 'drm not detected';
    }
}

player.load(source).then(
    function () {
        //Success
        log('Successfully created Bitmovin Player instance');
        log('playing '+ player)

    },
    function (reason) {
        //Error
        log('Error while creating Bitmovin Player instance');
    }
);


function log(m) {
    console.log(m)
    var log = document.getElementById('console');
    log.innerHTML += '</br>' + m
}




