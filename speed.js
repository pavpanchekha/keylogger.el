function avg_time_total(data) {
    var total = 0;
    var time = 0.0;
    for (var i in data) {
        total += data[i][1];
        time += data[i][0];
    }
    return {total: total, avg_time: time / total};
}

function avg_word(data) {
    var res = avg_time_total(data);
    var avg_len = avg_word_length(data, res.total);
    var avg_time = res.avg_time * avg_len;
    return {len: avg_len, time: avg_time, wpm: 60 / avg_time}; // 60 == secs in a minute
}

function speed(data) {
    var sec = document.getElementById("speed");
    
    var avgs = avg_word(data);
    sec.getElementsByClassName("len")[0].textContent = Math.round(avgs.len * 100) / 100 + " characters";
    sec.getElementsByClassName("wpm")[0].innerHTML = Math.round(avgs.wpm) + " <abbr title='Words per Minute'>wpm</abbr>";
}
