layout_data = {
    qwerty: ["qwertyuiop[]", "asdfghjkl;'", "zxcvbnm,./ ", 
             "QWERTYUIOP{}", "ASDFGHJKL:\"", "ZXCVBNM<>?"],
    dvorak: ["',.pyfgcrl/=", "aoeuidhtns-", ";qjkxbmwvz ",
             "\"<>PYFGCRL?+", "AOEUIDHTNS_", ":QJKXBMWVZ"],
    colemak: ["qfpgjluy;[", "arstdhneio'", "zxcvbkm,./ ",
              "QWFPGJLUY:{", "ARSTDHNEIO\"", "ZXCVBKM<>?"]
}

function find_index(chr, arr_str) {
    for (var i = 0; i < arr_str.length; i++) {
        var j = arr_str[i].indexOf(chr);
        if (j != -1) return [i, j];
    }

    return null;
}

function translate_char(chr, layout_from, layout_to) {
    var lfrom = layout_data[layout_from];
    var lto = layout_data[layout_to];

    // First char
    var fchar = find_index(chr, lfrom);
    if (!fchar) return null;
    var tran_fchar = lto[fchar[0]][fchar[1]];
    return tran_fchar;
}

function translate_digraph(dg, layout_from, layout_to) {
    var tc1 = translate_char(dg[0], layout_from, layout_to);
    var tc2 = translate_char(dg[1], layout_from, layout_to);
    if (tc1 && tc2) return tc1 + tc2;
    return null;
}

function translated_average_stroke(data, layout_from, layout_to) {
    var time = 0;
    var total = 0;
    for (var i = 0; i < 96; i++) {
        for (var j = 0; j < 96; j++) {
            var idx = i * 96 + j;
            var digraph = idx_to_digraph(idx);
            if (!data[idx]) continue;
            var freq = data[idx][1];
            var new_digraph = translate_digraph(digraph, layout_to, layout_from); // Note swap
            if (! new_digraph) continue;

            var new_idx = digraph_to_idx(new_digraph);
            if (! data[new_idx]) continue;

            var new_idx_avg = data[new_idx][0] / data[new_idx][1];
            if (!new_idx_avg) continue;
            total += freq;
            time += new_idx_avg * freq;
        }
    }
    return time / total;
}

function compare_timing(data, digraph, layout_from, layout_to) {
    var new_digraph = translate_digraph(digraph, layout_to, layout_from); // Note swap
    var from_idx = digraph_to_idx(digraph);
    var to_idx = digraph_to_idx(new_digraph);

    return {"old": data[from_idx][0] / data[from_idx][1],
            "new": data[to_idx][0] / data[to_idx][1]};
}

function total_digs(data) {
    var total = 0;
    for (var i in data) {
        total += data[i][1];
    }
    return total;
}

function layouts(data) {
    sec = document.getElementById("layouts");

    var avg_word = avg_word_length(data, total_digs(data));

    var dvorak_wpm = 60 / (avg_word *
                           translated_average_stroke(data, "qwerty", "dvorak"));
    var colemak_wpm = 60 / (avg_word *
                            translated_average_stroke(data, "qwerty", "colemak"));

    sec.getElementsByClassName("dvorak")[0].innerHTML = Math.round(dvorak_wpm) +
        " <abbr title='Words per Minute'>wpm</abbr>";
    sec.getElementsByClassName("colemak")[0].innerHTML = Math.round(colemak_wpm) +
        " <abbr title='Words per Minute'>wpm</abbr>";
}
