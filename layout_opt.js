kbd_rows = layout_data.qwerty.slice(0, 3);
kbd_letters = "";

for (var i in kbd_rows) {
    kbd_letters += kbd_rows[i];
}

function test_layout(data, layout) {
    layout_data["."] = break_layout(layout);
    var out = translated_average_stroke(data, "qwerty", ".");
    delete layout_data["."];
    return out;
}

function break_layout(str) {
    var layout = [];
    var len = 0;
    for (var i in kbd_rows) {
        layout.push(str.slice(len, len + kbd_rows[i].length));
        len += kbd_rows[i].length;
    }
    return layout;
}

// via: http://stackoverflow.com/questions/2450954/how-to-randomize-a-javascript-array
function fisherYates ( myArray ) {
  var i = myArray.length;
  if ( i == 0 ) return false;
  while ( --i ) {
     var j = Math.floor( Math.random() * ( i + 1 ) );
     var tempi = myArray[i];
     var tempj = myArray[j];
     myArray[i] = tempj;
     myArray[j] = tempi;
   }
   return myArray;
}

function test_random_layout(data) {
    var str = fisherYates(kbd_letters.split("")).join("");
    return {layout: layout, score: test_layout(data, layout)};
}

function cmpfn(f) {
    return function(a, b) {
        var fa = f(a), fb = f(b);
        return fa < fb ? -1 : fa == fb ? 0 : 1;
    };
}

function greedy_layout(data) {
    function letter_freq(digraph) {
        var entry = data[digraph_to_idx(digraph)];
        return entry ? entry[1] : 0;
    }

    function pos_speed(digraph) {
        var entry = data[digraph_to_idx(digraph)];
        return (entry && entry[1] > 10) ? (entry[0] / entry[1]) : 2;
    }

    pairs = []
    for (var i in kbd_letters) {
        for (var j in kbd_letters) {
            pairs.push(kbd_letters[i] + kbd_letters[j]);
        }
    }
    digraphs = pairs.concat()

    pairs.sort(cmpfn(pos_speed));
    digraphs.sort(cmpfn(letter_freq));

    layout = {};
    rlayout = {};

    while (digraphs.length) {
        var digraph = digraphs.pop();

        var first = layout[digraph[0]];
        var second = layout[digraph[1]];

        if (first && second) continue;

        for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i];
            if (first && pair[0] != first) continue;
            if (second && pair[1] != second) continue;

            var pfirst = rlayout[pair[0]];
            var psecond = rlayout[pair[1]];
            if (pfirst && digraph[0] != pfirst) continue;
            if (psecond && digraph[1] != psecond) continue;

            layout[digraph[0]] = pair[0];
            layout[digraph[1]] = pair[1];
            rlayout[pair[0]] = digraph[0];
            rlayout[pair[1]] = digraph[1];
            break;
        }
    }

    layout_str = kbd_letters.split("").map(function(l){return layout[l];}).join("");
    return {layout: layout_str, score: test_layout(data, layout_str)};
}

function randint(a) {
    return Math.floor(Math.random() * a);
}

function string_swap(str, i, j) {
    if (j < i) { var t = i; i = j; j = t; }
    if (i == j) return str;

    return str.slice(0, i) + str[j] +
        str.slice(i+1, j) + str[i] +
        str.slice(j+1, str.length);
}

function mutate_layout(layout, n) {
    for (var i = 0; i < (n || 1); i++) {
        var l = randint(layout.length);
        var r = randint(layout.length);
        layout = string_swap(str, i, j);
    }
    return layout;
}

function climb_once(data, layout) {
    var score = test_layout(data, layout)
    for (var i = 0; i < kbd_letters.length; i++) {
        for (var j = i + 1; j < kbd_letters.length; j++) {
            var alt_layout = string_swap(layout, i, j);
            var alt_score = test_layout(data, alt_layout);
            if (alt_score < score) return alt_layout;
        }
    }
    return false;
}

function hill_climb(data, layout) {
    while (true) {
        var new_layout = climb_once(data, layout);
        if (!new_layout) return layout;
        layout = new_layout
        console.log(layout);
    }
}

function best_of_n(data, n) {
    var best_score = 2;
    var best_layout = null;
    for (var i = 0; i < n; i++) {
        var sample = test_random_layout(data);
        if (sample.score < best_score) {
            best_score = sample.score;
            best_layout = sample.layout;
        }
    }

    return {layout: best_layout, score: best_score};
}
