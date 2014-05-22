var tracker = require("./lib/tracker");
var util = require('util');

function testAddPeers() {
    var t = tracker.Tracker();
    var torrent = t.getTorrent('640FE84C613C17F663551D218689A64E8AEBEABE');

    var start = new Date().getTime();
    for (var i = 0; i < 1000000; i++) {
        var peerIp = '' + Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255);
        var peerPort = '' + Math.floor(Math.random() * 65535);
        var peerId = peerIp + ':' + peerPort;
        var peerSeeder = Math.floor(Math.random() * 2);
        var peer = tracker.Peer(peerIp, peerPort, peerSeeder);
        torrent.addPeer(peerId, peer, 2);
    }
    var end = new Date().getTime();
    console.log("Time to add 1M peers in ms: " + (end - start));
    console.log(util.inspect(process.memoryUsage()));
}

for(var runCount=0; runCount<5; runCount++){
    console.log("Starting run number "+runCount);
    testAddPeers();
}

console.log("Final memory usage:" );
console.log(util.inspect(process.memoryUsage()));
