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



parseManifest();
setBrowserLogo();

function setBrowserLogo(){
    if (bowser.chrome){
        document.getElementById('browser').innerHTML = 'Chrome'
        document.getElementById('browser-img').innerHTML = '<img src="browser/chrome-128.png" width="32" height="32"></img>'
    }
    else if (bowser.firefox){
        document.getElementById('browser').innerHTML = 'Firefox'
        document.getElementById('browser-img').innerHTML = '<img src="browser/firefox-128.png" width="32" height="32"></img>'
    }
    else if (bowser.safari){
        document.getElementById('browser').innerHTML = 'Safari'
        document.getElementById('browser-img').innerHTML = '<img src="browser/safari-128.png" width="32" height="32"></img>'
    }
    else if (bowser.msie){
        document.getElementById('browser').innerHTML = 'Internet Explorer'
        document.getElementById('browser-img').innerHTML = '<img src="browser/ie-128.png" width="32" height="32"></img>'
    }
}

function play() {

    var source = {};
    var foundHevc = false;
    var foundVp9 = false;
    for (let i = 0; i < sources.length; i++) {
        var src = sources[i]
        if (src.id == "hevc" && src.supported) {
            source = { "dash": src.url }
            foundHevc = true
            document.getElementById('supported-codec').innerHTML = "HEVC"


        } else if (src.id == "vp9" && src.supported && !foundHevc) {
            source = { "dash": src.url }
            foundVp9 = true;
            document.getElementById('supported-codec').innerHTML = "VP9"
    
        } else if (src.id == "avc" && !(foundHevc || foundVp9)) {
            source = { "dash": src.url }
            document.getElementById('supported-codec').innerHTML = "AVC"

        }
    }

    
  


    log("Playing URL:" + source.dash)
    var container = document.getElementById('player');
    var player = new bitmovin.player.Player(container, config);
    player.load(source).then(
        function () {
            //Success


        },
        function (reason) {
            //Error

        }
    );

}



function parseManifest() {
    urls.forEach(function (src) {
        axios.get(src.url)
            .then(function (response) {
                // handle success
                //  console.log(JSON.stringify(response.data));
                log("---------------++++++++++++++++++++++++---------------")
                src['mimeType'] = getMimeType(response.data)
                src['codecs'] = getCodecs(response.data)
                log("checking url:" + src.url)
                log("----  detected mimeType:" + src.mimeType)
                var supported = true
                src['codecs'].forEach(function (codec) {
                    log("----- detected codec:" + codec)
                    log("----- supported Browser:" + supportedBrowser(src.mimeType, codec))
                    supported = supported && supportedBrowser(src.mimeType, codec)
                })
                log("----  All Adaptation sets supported: " + supported)
                sources.push({ "url": src.url, "supported": supported, "id": src.id });
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .finally(function () {

            });

    })
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
    document.getElementById("console").innerHTML += m + '<br>'
}






// function log(m) {
//     console.log(m)
//     var log = document.getElementById('console');
//     log.innerHTML += '</br>' + m
// }




