function idx_to_digraph(idx) {
    return String.fromCharCode(Math.floor(idx / 96) + 32,
                               (idx % 96) + 32);
}

function digraph_to_idx(idx) {
    return (idx.charCodeAt(0) - 32) * 96 +
        (idx.charCodeAt(1) - 32);
}

function avg_word_length(data, total) {
    var space = data.slice(digraph_to_idx("  "), digraph_to_idx("! "))
        .map(function (x) {return x[1];});
    var space_total = 0;
    for (var i = 0; i < space.length; i++) {
        space_total += space[i] || 0; // The ||0 filters out NaNs and similar
    }

    return total / space_total;
}
