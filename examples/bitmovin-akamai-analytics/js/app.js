
var config = {
    "key": "a3b4a6a3-37e5-4e9f-b275-fcf8b9c4d7c9",
    advertising: {
        adBreaks: [{
            tag: {
                url: '//pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/32573358/skippable_ad_unit&impl=s&gdfp_req=1&env=vp&output=xml_vast2&unviewed_position_start=1&url=http%3A%2F%2Freleasetest.dash-player.com%2Fads%2F&description_url=[description_url]&correlator=[random]',
                type: 'vast',
            },
        }],
    }

}



var source = {
    title: 'Art of Motion',
    description: 'What is this event... Parcour?',
    hls: '//bitmovin-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8',
    progressive: '//bitmovin-a.akamaihd.net/content/MI201109210084_1/MI201109210084_mpeg-4_hd_high_1080p25_10mbits.mp4'
};

var akamaiAnalytics = new JS_AkamaiMediaAnalytics("SampleBeacon.xml");
// Setting Custom Data
akamaiAnalytics.setData("title", "My hello worlds");
akamaiAnalytics.setData("eventName", "Game Of Thrones - Season 1 Winter Is Coming");
akamaiAnalytics.setData("device", "iPhone 7");
akamaiAnalytics.setData("deliveryType", "L");
akamaiAnalytics.setData("cdn", "Akamai");
akamaiAnalytics.setData("category", "TV Shows");
akamaiAnalytics.setData("subCategory", "Fantasy Drama");
akamaiAnalytics.setData("show", "Game Of Thrones");
akamaiAnalytics.setData("contentLength", "3697"); // Value in seconds
akamaiAnalytics.setData("playerId", "SamplePlayer01");
akamaiAnalytics.setViewerId("uniqueIdentifier");


var container = document.getElementById('player');
var player = new bitmovin.player.Player(container, config);


player.load(source).then(
    function () {
        //Success
        console.log('Successfully created Bitmovin Player instance');
    },
    function (reason) {
        //Error
        console.log('Error while creating Bitmovin Player instance');
    }
);





player.on('play', function (o) {

    var event = document.getElementById('event')
    var akamai_handle = document.getElementById('handle')
    event.innerHTML = 'Play'
    akamai_handle.innerHTML = 'akamaiAnalytics.handlePlaying()'

    codeBlock('play','handlePlaying()')

    log('+++ akamaiAnalytics beacon fired "akamaiAnalytics.handlePlaying()"  +++');
    if (akamaiAnalytics) {
        akamaiAnalytics.handlePlaying();
    }

});

player.on('paused', function (o) {
    var event = document.getElementById('event')
    var akamai_handle = document.getElementById('handle')
    event.innerHTML = 'Paused'
    akamai_handle.innerHTML = 'akamaiAnalytics.handlePause()'
    codeBlock('paused','handlePause()')

    log('+++ akamaiAnalytics beacon fired "akamaiAnalytics.handlePause()" +++');
    if (akamaiAnalytics) {
        akamaiAnalytics.handlePause();
    }
});

player.on("seeked", function () {
    var event = document.getElementById('event')
    var akamai_handle = document.getElementById('handle')

    event.innerHTML = 'Seeked'
    akamai_handle.innerHTML = 'akamaiAnalytics.handleSeekStart()'
    codeBlock('seeked','handleSeekStart()')

    if (akamaiAnalytics) {
        log('+++ akamaiAnalytics beacon fired "akamaiAnalytics.handleSeekStart()" +++');
        akamaiAnalytics.handleSeekStart();
    }
});

player.on("adstarted", function () {

    var event = document.getElementById('event')
    var akamai_handle = document.getElementById('handle')
    codeBlock('adstarted','handleAdStarted()')

    
    event.innerHTML = 'Adstarted'
    akamai_handle.innerHTML = ' akamaiAnalytics.handleAdStarted()'

    if (akamaiAnalytics) {
        var adInfoObject = {};
        adInfoObject["adDuration"] = adDuration; // duration is in milliseconds
        akamaiAnalytics.handleAdStarted(adObject);
        log('+++ akamaiAnalytics beacon fired "akamaiAnalytics.handleAdStarted" +++');
    }
});
player.on("adskipped", function () {

    codeBlock('adskipped','handleAdSkipped()')
    var event = document.getElementById('event')
    var akamai_handle = document.getElementById('handle')
    
    event.innerHTML = 'Adskipped'
    akamai_handle.innerHTML = 'akamaiAnalytics.handleAdSkipped()'


    if (akamaiAnalytics) {
        akamaiAnalytics.handleAdSkipped()
        log('+++ akamaiAnalytics beacon fired "akamaiAnalytics.handleAdSkipped()" +++');
    }
});
player.on("adfinished", function () {

    var event = document.getElementById('event')
    var akamai_handle = document.getElementById('handle')

    codeBlock('adfinished','handleAdComplete()')
    
    event.innerHTML = 'Adfinished'
    akamai_handle.innerHTML = 'akamaiAnalytics.handleAdComplete();'

    if (akamaiAnalytics) {
        akamaiAnalytics.handleAdComplete();
        log('+++ akamaiAnalytics beacon fired "akamaiAnalytics.handleAdComplete()" +++');
    }
});

function log(m) {
    console.log(m)
    var log = document.getElementById('console');
    log.innerHTML += '</br>' + m
}

function codeBlock(event,handler){
    var element = document.getElementById('code')
    element.innerHTML = "player.on(&quot;"+event+"&quot;, function () { <br>\
        &emsp;&emsp;if (akamaiAnalytics) {  <br>\
            &emsp;&emsp;&emsp;&emsp;akamaiAnalytics."+handler+"  <br>\
            &emsp;&emsp;}  <br>\
    });"
}
