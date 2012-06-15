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
    sec.getElementsByClassName("time")[0].innerHTML = Math.round(time) + " seconds";
    sec.getElementsByClassName("transitions")[0].innerHTML =
        transitions + " (" + Math.round(100 * transitions / 96 / 96) + "%)";
}
