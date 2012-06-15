#!/usr/bin/env python3

import sys
import os

INFILE  = sys.argv[1] if len(sys.argv) > 1 else os.path.expanduser("~/.emacs.d/keys")
OUTFILE = sys.argv[2] if len(sys.argv) > 2 else "keys.jsonp"

with open(INFILE) as f:
    # First line blank
    assert not f.readline().strip()

    # Second line has an array
    v = f.readline().strip()
    assert v and v[0] == "[" and v[-1] == "]"
    data = [[float(s)] for s in v[1:-1].split()]
    
    # Third line blank
    assert not f.readline().strip()

    # Fourth line has another array
    v = f.readline().strip()
    assert v and v[0] == "[" and v[-1] == "]"
    for i, s in enumerate(v[1:-1].split()):
        data[i].append(int(s))

    assert len(data) == 96 * 96

with open(OUTFILE, "w") as f:
    f.write("load_data(")
    f.write(str(data))
    f.write(")")
