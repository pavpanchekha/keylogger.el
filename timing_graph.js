function draw_distroke(ctx, i, x, y) {
    ctx.fillText(idx_to_digraph(i), x * 600, 400 - y*400);
    //ctx.arc(x, y, 5, 0, 2*Math.PI, false);
}

function timing_graph(data) {
    var ctx = document.getElementById("timing_graph").getContext("2d");

    var maxcount = 0;
    var maxavg = 0;
    for (var i in window.data) {
        var count = window.data[i][1];
        var avg   = window.data[i][0] / count;
        if (count > maxcount) maxcount = count;
        if (avg   > maxavg)   maxavg   = avg;
    }

    ctx.fillStyle = "rgba(78, 154, 6, .6)"; // Tango dark green
    ctx.beginPath()
    for (var i in data) {
        var count = window.data[i][1];
        var avg   = window.data[i][0] / count;
        draw_distroke(ctx, i, avg/maxavg, count/maxcount);
    }
    ctx.fill();
}
