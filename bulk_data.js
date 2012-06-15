function secs_to_time(secs) {
    var hours = 0;
    var minutes = 0;

    if (secs > 60 * 60) {
        hours = Math.floor(secs / 60 / 60);
        secs -= hours * 60 * 60;
    }

    if (secs > 60) {
        minutes = Math.floor(secs / 60);
        secs -= minutes * 60;
    }

    secs = Math.round(secs);

    if (hours > 24) {
        return hours + " h";
    } else if (hours) {
        return hours + " h" + (minutes ? ", " + minutes + " m" : "");
    } else if (minutes) {
        return minutes + " m" + (secs ? ", " + secs + " s" : "");
    } else {
        return secs + " s";
    }
}

function bulk_data(data) {
    var sec = document.getElementById("bulk_data");
    
    var total = 0;
    var time = 0.0;
    var transitions = 0;
    for (var i in data) {
        total += data[i][1];
        time += data[i][0];
        transitions += 1;
    }

    sec.getElementsByClassName("total")[0].innerHTML = total;
    sec.getElementsByClassName("time")[0].innerHTML = secs_to_time(time);
    sec.getElementsByClassName("transitions")[0].innerHTML =
        transitions + " (" + Math.round(100 * transitions / 96 / 96) + "%)";
}
