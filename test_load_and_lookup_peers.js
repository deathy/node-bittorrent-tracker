var tracker = require("./lib/tracker");
var util = require('util');

function testAddPeers(warmup) {
    var t = tracker.Tracker();
    var torrent = t.getTorrent('640FE84C613C17F663551D218689A64E8AEBEABE');

    var start = new Date().getTime();
    for (var i = 0; i < 100000; i++) {
        var peerIp = '' + Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255);
        var peerPort = '' + Math.floor(Math.random() * 65535);
        var peerId = peerIp + ':' + peerPort;
        var peerSeeder = Math.floor(Math.random() * 2);
        var peer = tracker.Peer(peerIp, peerPort, peerSeeder);
        torrent.addPeer(peerId, peer, 2);
    }
    var end = new Date().getTime();
    if(!warmup) {
        console.log("Time to add 100k peers in ms: " + (end - start));
        console.log(util.inspect(process.memoryUsage()));
    }

    start = new Date().getTime();
    var numWant = 50;
    for (var i = 0; i < 1000000; i++) {
        var peerIp = '' + Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255);
        var peerPort = '' + Math.floor(Math.random() * 65535);
        var peerId = peerIp + ':' + peerPort;
        var peerSeeder = Math.floor(Math.random() * 2);
        var peer = tracker.Peer(peerIp, peerPort, peerSeeder);
        var peerBuffer = new Buffer(numWant * tracker.PEER_COMPACT_SIZE);
        var len = torrent.writePeers(peerBuffer, numWant, peer);
        peerBuffer = peerBuffer.slice(0, len);
    }
    end = new Date().getTime();
    if(!warmup) {
        console.log("Time for 1Mil lookups of "+numWant+" peers in ms: " + (end - start));
        console.log(util.inspect(process.memoryUsage()));
    }

}

// Warmup
for(var warmupRun=0; warmupRun<10; warmupRun++){
    testAddPeers(true);
}

// Actual runs
for(var runCount=0; runCount<100; runCount++){
    console.log("Starting run number "+runCount);
    testAddPeers(false);
}

console.log("Final memory usage:" );
console.log(util.inspect(process.memoryUsage()));
