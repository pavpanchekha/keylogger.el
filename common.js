function idx_to_digraph(idx) {
    return String.fromCharCode(Math.floor(idx / 96) + 32,
                               (idx % 96) + 32);
}

function digraph_to_idx(idx) {
    return (idx.charCodeAt(0) - 32) * 96 +
        (idx.charCodeAt(1) - 32);
}
