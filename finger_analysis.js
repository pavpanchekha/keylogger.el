// l and r stand for left and right; L and S for Lowercase and Shifted
var hands = {
    lL: ["az", "123wsx", "4ed", "56rtfgcv", " "],
    lS: ["AZ", "!@#WSX", "$ED", "%^RTFGCV", ""],
    rL: [";'/", "pol0.", "9ik", "78yuhjnmb", ""],
    rS: [":\"", "POL)>", "(IK", "&*YUHJNMB", ""]
}

var letters = {}

for (var c = 32; c < 128; c++) {
    for (var hand in hands) {
        for (var finger = 0; finger < 5; finger++) {
            if (hands[hand][finger].indexOf(String.fromCharCode(c)) >= 0) {
                letters[c] = hand+finger
            }
        }
    }
}

var handfingers = []

for (var hand in hands) {
    for (var finger = 0; finger < 5; finger++) {
        handfingers.push(hand+finger);
    }
}

// Returns a pair of
// + Are the strokes from the same hand
// + Are the strokes from the same finger
function classify_transition(hf1, hf2) {
    // Ignoring shifting/unshifting for now
    return [hf1.charAt(0) == hf2.charAt(0),
            hf1.charAt(2) == hf2.charAt(2)]
}

function finger_analyze(data) {
    var timediffs = {}
         
    for (var i in handfingers) {
        hf = handfingers[i];
        timediffs[hf] = {}
        for (var j in handfingers) {
            hf2 = handfingers[j];
            timediffs[hf][hf2] = [0, 0];
        }
    }

    for (var i in data) {
        var distroke = idx_to_digraph(i);
        var finger_from = letters[distroke.charCodeAt(0)];
        var finger_to   = letters[distroke.charCodeAt(1)];
        if (!finger_from || !finger_to) continue;
        var arr = timediffs[finger_from][finger_to]
        arr[0] += data[i][0];
        arr[1] += data[i][1];
    }

    var analysis = {
        ss: [0, 0], sd: [0, 0], ds: [0, 0], dd: [0, 0]
    }

    for (var hf in timediffs) {
        for (var hf2 in timediffs) {
            var type = classify_transition(hf, hf2);
            var bucket = (type[0] ? "s" : "d") + (type[1] ? "s" : "d");
            var vals = analysis[bucket];
            vals[0] += timediffs[hf][hf2][0];
            vals[1] += timediffs[hf][hf2][1];
        }
    }

    return analysis;
}

function finger_analysis(data) {
    var sec = document.getElementById("finger_analysis");
    var res = finger_analyze(data);

    var d  = (res.dd[0] + res.ds[0]) / (res.dd[1] + res.ds[1]);
    var sd = res.sd[0] / res.sd[1];
    var ss = res.ss[0] / res.ss[1];
    
    sec.getElementsByClassName("d")[0].innerHTML  = Math.round(1000*d) + " ms";
    sec.getElementsByClassName("sd")[0].innerHTML = Math.round(1000*sd) + " ms";
    sec.getElementsByClassName("ss")[0].innerHTML = Math.round(1000*ss) + " ms";

    var same_position = [0, 0];
    for (c = 0; c < 96; c++) {
        // 97 * c = 96 * c + c
        if (data[97*c]) {
            same_position[0] += data[97*c][0];
            same_position[1] += data[97*c][1];
        }
    }
    var sp = same_position[0] / same_position[1];

    sec.getElementsByClassName("sp")[0].innerHTML = Math.round(1000*sp) + " ms";

    var fastest_transition = 10000;
    var fastest_idx;
    var slowest_transition = 0;
    var slowest_idx;
    for (var i in data) {
        var avg = data[i][0] / data[i][1];
        if (avg < fastest_transition) {
            fastest_transition = avg;
            fastest_idx = i;
        }
        if (avg > slowest_transition) {
            slowest_transition = avg;
            slowest_idx = i;
        }
    }

    sec.getElementsByClassName("slowest")[0].innerHTML = idx_to_digraph(slowest_idx);
    sec.getElementsByClassName("fastest")[0].innerHTML = idx_to_digraph(fastest_idx);
}
