var config = {
    "key": "a3b4a6a3-37e5-4e9f-b275-fcf8b9c4d7c9"
}

var urls = [
    { "url": "https://bitmovin-a.akamaihd.net/content/multi-codec/h264/stream.mpd", "id": "avc" },
    { "url": "https://bitmovin-a.akamaihd.net/content/multi-codec/hevc/stream.mpd", "id": "hevc" },
    { "url": "https://bitmovin-a.akamaihd.net/content/multi-codec/vp9/stream.mpd", "id": "vp9" }
]


var sources = [];

console.log(bowser.chrome);
var player;
var dataDownload = 0;
var savedDataDownload = 0;


parseManifest();
setBrowserLogo();

function setBrowserLogo() {
    if (bowser.chrome) {
        document.getElementById('browser').innerHTML = 'Chrome'
        document.getElementById('browser-img').innerHTML = '<img src="browser/chrome-128.png" width="32" height="32"></img>'
    }
    else if (bowser.firefox) {
        document.getElementById('browser').innerHTML = 'Firefox'
        document.getElementById('browser-img').innerHTML = '<img src="browser/firefox-128.png" width="32" height="32"></img>'
    }
    else if (bowser.safari) {
        document.getElementById('browser').innerHTML = 'Safari'
        document.getElementById('browser-img').innerHTML = '<img src="browser/safari-128.png" width="32" height="32"></img>'
    }
    else if (bowser.msie) {
        document.getElementById('browser').innerHTML = 'Internet Explorer'
        document.getElementById('browser-img').innerHTML = '<img src="browser/ie-128.png" width="32" height="32"></img>'
    }
}

function detectCodec(codecs) {
    var codec =''
    codecs.forEach(function (c) {
        console.log(codec)
        if (c.includes('hvc')) {
            codec =  'hevc'
        } else if (c.includes('vp9')) {
            codec =  'vp9'
        } else if (c.includes('avc')) {
            codec =  'avc'
        } 
    })
    return codec;
}

function play() {

    var source = {};
    var foundHevc = false;
    var foundVp9 = false;
    for (let i = 0; i < sources.length; i++) {
        var src = sources[i]
        if (src.id == "hevc" && src.supported) {
            source = { "dash": src.url, "codec": "hevc" }
            foundHevc = true
            document.getElementById('supported-codec').innerHTML = "HEVC"


        } else if (src.id == "vp9" && src.supported && !foundHevc) {
            source = { "dash": src.url, "codec": "vp9" }
            foundVp9 = true;
            document.getElementById('supported-codec').innerHTML = "VP9"

        } else if (src.id == "avc" && !(foundHevc || foundVp9)) {
            source = { "dash": src.url, "codec": "avc" }
            document.getElementById('supported-codec').innerHTML = "AVC"

        }
    }



    log("Playing URL:" + source.dash)
    var container = document.getElementById('player');
    player = new bitmovin.player.Player(container, config);
    player.load(source).then(
        function () {
            //Success


        },
        function (reason) {
            //Error

        }
    );

    player.on('timechanged', function (event) {
        currentTime = event.time;
        document.getElementById('current-codec').innerHTML = 'Playing codec: ' + source.codec
        document.getElementById('current-rate').innerHTML = player.getPlaybackVideoData().bitrate / 1000000 + 'Mbps'
        document.getElementById('current-res').innerHTML = player.getPlaybackVideoData().width + 'x' + player.getPlaybackVideoData().height

    })

    player.on('segmentrequestfinished', function (segment) {
        dataDownload = segment.size + dataDownload

        if (source.codec == 'hevc') {
            savedDataDownload = dataDownload;
        } else if (source.codec == 'vp9') {
            savedDataDownload = (dataDownload * 1.42) - dataDownload;
        } else {
            savedDataDownload = 0;
        }

        document.getElementById('data-download').innerHTML = Math.floor(dataDownload / 1000000) + 'MB'
        document.getElementById('data-savings').innerHTML = Math.floor(savedDataDownload / 1000000) + 'MB'
        document.getElementById('cost-savings').innerHTML = '$' + Math.floor(savedDataDownload / 1000000000 * (100000) * (0.25) / 100)
    });
}


function getURL(url) {
    return axios.get(url)
}


function parseManifest() {
    promises = []
    urls.forEach(function (src) {
        promises.push(getURL(src.url))
    })

    axios.all(promises)
        .then(function (responses) {
            responses.forEach(function (response) {
                // handle success
                console.log(response);
                log("---------------++++++++++++++++++++++++---------------")
                var mimeType = getMimeType(response.data)
                var codecs = getCodecs(response.data)
                log("checking url:" + response.config.url)
                log("----  detected mimeType:" + mimeType)
                var supported = true
                codecs.forEach(function (codec) {
                    log("----- detected codec:" + codec)
                    log("----- supported Browser:" + supportedBrowser(mimeType, codec))
                    supported = supported && supportedBrowser(mimeType, codec)
                })
                log("----  All Adaptation sets supported: " + supported)
                sources.push({ "url": response.config.url, "supported": supported, "id": detectCodec(codecs) });
            })
            console.log(sources)
            play()
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .finally(function () {

        });
}

function supportedBrowser(mimeType, codec) {
    return MediaSource.isTypeSupported(`${mimeType}; codecs="${codec}"`)
}

function checkAdaptation(xml) {
    this.xml = xml;
    parser = new DOMParser();
    xmlDoc = parser.parseFromString(xml, "text/xml");
    var mimeType = xmlDoc.getElementsByTagName("AdaptationSet")[0].getAttribute('mimeType')
    return mimeType;
}


function getMimeType(xml) {
    this.xml = xml;
    parser = new DOMParser();
    xmlDoc = parser.parseFromString(xml, "text/xml");
    var mimeType = xmlDoc.getElementsByTagName("AdaptationSet")[0].getAttribute('mimeType')
    return mimeType;
}

function getCodecs(xml) {
    var codecs = []
    this.xml = xml;
    parser = new DOMParser();
    xmlDoc = parser.parseFromString(xml, "text/xml");
    var nodes = xmlDoc.getElementsByTagName("AdaptationSet")[0].getElementsByTagName('Representation')
    for (let i = 0; i < nodes.length; i++) {

        codecs.push(nodes[i].getAttribute('codecs'))
    }
    return codecs;
}


function log(m) {
    document.getElementById("console").innerHTML = m + '<br>' + document.getElementById("console").innerHTML
}






// function log(m) {
//     console.log(m)
//     var log = document.getElementById('console');
//     log.innerHTML += '</br>' + m
// }




