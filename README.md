keylogger.el
============

`keylogger.el` is an Emacs library which records transition times
between pairs of keys and has a neat GUI for analyzing the results.

For an example of the results and the analysis this lets you do, see
https://pavpanchekha.com/blog/emacs-keylogger.html

Installation
------------

Download the source code and load, such as by adding a `load` call to
your `.emacs.d/init.el`:

    (load "<path-to-source>/keylogger.el")

Then add the following invocations to start the keylogger every time
you start Emacs:

    (setf keylogger-filename "<path-to-data>/keys.el")
    (keylogger-load)
    (keylogger-start)
    (keylogger-autosave)

These lines set the file to store key data in, load the existing data,
start the keylogger, and set it to save every 15 minutes.

If you're using multiple computers, you might prefer having a
different save file for each computer. That way, when you sync files,
there aren't any conflicts.

Analyzing the data
------------------

To analyze the data, you need to convert it into a file named
`keys.jsonp` in the same directory as `graph.html` using the
`transform.py`:

    python2 transform.py keys.el > keys.jsonp

If you have multiple save files, you can list them as multiple
arguments to `transform.py`.

Then, view `graph.html` in a browser.
