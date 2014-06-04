var autonomoussystems = [],
    numautonomoussystems = 0;

var geoip = module.exports = {

    ready: false,

    lookup: function (ip) {

        if (!geoip.ready) {
            return { error: "GeoIP not ready" };
        }

        var ipl = iplong(ip);

        if (ipl == 0) {
            return { error: "Invalid ip address " + ip + " -> " + ipl + " as integer" };
        }

        return find(ipl);
    }
};

function iplong(ip) {

    if (!ip) {
        return 0;
    }

    ip = ip.toString();

    if (isNaN(ip) && ip.indexOf(".") == -1) {
        return 0;
    }

    if (ip.indexOf(".") == -1) {

        try {
            ip = parseFloat(ip);
            return ip < 0 || ip > 4294967296 ? 0 : ip;
        }
        catch (s) {
        }
    }

    var parts = ip.split(".");

    if (parts.length != 4) {
        return 0;
    }

    var ipl = 0;

    for (var i = 0; i < 4; i++) {
        parts[i] = parseInt(parts[i], 10);

        if (parts[i] < 0 || parts[i] > 255) {
            return 0;
        }

        ipl += parts[3 - i] * (Math.pow(256, i));
    }

    return ipl > 4294967296 ? 0 : ipl;
}

/**
 * A qcuick little binary search
 * @param ip the ip we're looking for
 * @return {*}
 */
function find(ipl) {

    var imax = numautonomoussystems-1, imin = 0;

    while (imax >= imin) {
        // calculate the midpoint for roughly equal partition
        var imid = Math.floor((imin + imax) / 2);
        var autonomoussystem = autonomoussystems[imid];
        if (autonomoussystem.ipstart <= ipl && autonomoussystem.ipend >= ipl) {
            // key found at index imid
            return autonomoussystem;
            // determine which subarray to search
        } else if (autonomoussystem.ipstart < ipl) {
            // change min index to search upper subarray
            imin = imid + 1;
        } else {
            // change max index to search lower subarray
            imax = imid - 1;
        }
    }
    // key was not found
    return undefined;
}

/**
 * Prepare the data.  This uses the standard free GeoIP CSV database
 * from MaxMind, you should be able to update it at any time by just
 * overwriting GeoIPASNum2.csv with a new version.
 */
(function () {

    var fs = require("fs");
    var sys = require("sys");
    var stream = fs.createReadStream(__dirname + "/GeoIPASNum2.csv");
    var buffer = "";

    stream.addListener("data", function (data) {
        buffer += data.toString().replace(/"/g, "");
    });

    stream.addListener("end", function () {

        var entries = buffer.split("\n");

        for (var i = 0; i < entries.length; i++) {
            var entry = entries[i].split(",");
            autonomoussystems.push({ipstart: parseInt(entry[0]), ipend: parseInt(entry[1]), asname: entry.slice(2).join(",")});
        }

        autonomoussystems.sort(function (a, b) {
            return a.ipstart - b.ipstart;
        });

        numautonomoussystems = autonomoussystems.length;
        geoip.ready = true;
    });

}());