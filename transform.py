#!/usr/bin/env python3

import sys
import os

def create():
    return [ [0.0, 0, 0.0] for i in range(96 * 96) ]

def read(f, data):
    # First line blank
    assert not f.readline().strip()

    # Second line has an array
    v = f.readline().strip()
    assert v and v[0] == "[" and v[-1] == "]"
    for i, s in enumerate(v[1:-1].split()):
        data[i][0] += float(s)
    
    # Third line blank
    assert not f.readline().strip()

    # Fourth line has another array
    v = f.readline().strip()
    assert v and v[0] == "[" and v[-1] == "]"
    for i, s in enumerate(v[1:-1].split()):
        data[i][1] += int(s)

    # Fifth line blank
    assert not f.readline().strip()

    # Sixth line has another array
    v = f.readline().strip()
    assert v and v[0] == "[" and v[-1] == "]"
    for i, s in enumerate(v[1:-1].split()):
        data[i][2] += float(s)

def main(files):
    
    data = create()
    for file in files:
        read(open(file, "rt"), data)
    return data
        
if __name__ == "__main__":
    files = sys.argv[1:]
    
    if not files:
        print("USAGE: transform.py datafile [datafile ...] > keys.jsonp")
        sys.exit(1)

    data = main(files)
    sys.stdout.write("load_data(")
    sys.stdout.write(str(data))
    sys.stdout.write(")")
