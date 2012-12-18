function draw_placeholder(ctx, x, y) {
    ctx.fillText("__", x * 590, 400 - y * 390);
}

function draw_distroke(ctx, i, x, y) {
    ctx.fillText(idx_to_digraph(i), x * 590, 400 - y*390);
}

function timing_graph(data) {
    var ctx = document.getElementById("timing_graph").getContext("2d");

    var total = 0;
    for (var i in data) {
        total += data[i][1];
    }

    var maxcount = 0;
    var maxavg = 0;
    for (var i in window.data) {
        var count = window.data[i][1];
        var avg   = window.data[i][0] / count;
        if (count < .5*Math.sqrt(total)) continue;
        if (count > maxcount) maxcount = count;
        if (avg   > maxavg)   maxavg   = avg;
    }

    ctx.beginPath();
    ctx.fillStyle = "#ddd";
    for (var i in data) {
        var count = window.data[i][1];
        var avg   = window.data[i][0] / count;
        draw_placeholder(ctx, avg/maxavg, count/maxcount);
    }
    ctx.font = "6pt monospace";
    ctx.fillStyle = "rgb(78, 154, 6)"; // Tango dark green
    for (var i in data) {
        var count = window.data[i][1];
        var avg   = window.data[i][0] / count;
        if (count >= .5*Math.sqrt(total)) {
            // Otherwise, not enough data to be meaningful
            draw_distroke(ctx, i, avg/maxavg, count/maxcount);
        }
    }
    ctx.fill();
}
