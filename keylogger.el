; 256 * Last-key + Next-key

(defgroup keylogger nil
  "Interkey timing recorder for Emacs"
  :prefix "keylogger-")

(defcustom keylogger-filename "~/.emacs.d/keys"
  "File in which to store the state of all of the key strokes
you've ever made.  Must be writable and readable.")

(defcustom keylogger-autosave-frequency (* 60 15)
  "How often to auto-save the collected data on key pair stroke
frequencies.  Saved to `keylogger-filename`.")

(defvar keylogger-counts (make-vector (* 96 96) 0)
  "This table stores the total number of times each key
transition has occured.  The indexing scheme is the same as
that for `*key-press-counts*`")

(defvar keylogger-times (make-vector (* 96 96) 0.0)
  "This table stores the total seconds used in the interkey timing for
each pair of keys.  The key transition i -> j has index (i - 32) * 96
+ (j - 32); thus export to JavaScript is not particularly heavy-weight
(10,000 or so elements)")

(defvar keylogger-squares  (make-vector (* 96 96) 0.0)
  "This table stores the total squared number of seconds used in
the inter-keystroke timing for each pair of keys; it is used in
computing the standard deviation of each key press")

(defvar keylogger-last 0)
(defvar keylogger-last-time 0)

(defun keylogger-key-press-to-idx (last next)
  (+ (* (- last 32) 96) (- next 32)))

(defun keylogger-record ()
  (let ((char last-command-event)
        (time (current-time))
        (last-char keylogger-last)
        (last-time keylogger-last-time))
    (setq keylogger-last char)
    (setq keylogger-last-time time)
    (when (and (listp last-time) (= (car last-time) (car time))
               (>= last-char 32) (>= char 32)
               (< last-char 128) (< char 128))
      (let* ((last-time (cdr last-time)) (time (cdr time))
             (sd (- (car time)  (car last-time))))
        (when (< sd 2)
          (let* ((md (- (cadr time) (cadr last-time)))
                 (td (+ sd (/ (float md) 1000000.0)))
                 (entry (keylogger-key-press-to-idx last-char char))
                 (entry-sum (aref keylogger-times entry))
                 (entry-sqsum (aref keylogger-squares entry))
                 (entry-count (aref keylogger-counts entry)))
            (aset keylogger-times entry (+ entry-sum td))
            (aset keylogger-squares entry (+ entry-sqsum (* td td)))
            (aset keylogger-counts entry (+ entry-count 1))))))))

(defun keylogger-start ()
  (interactive)
  (add-hook 'post-self-insert-hook #'keylogger-record))

(defun keylogger-erase()
  (interactive)
  (setq keylogger-times   (make-vector (* 96 96) 0.0))
  (setq keylogger-counts  (make-vector (* 96 96) 0))
  (setq keylogger-squares (make-vector (* 96 96) 0.0)))

(defvar keylogger-timer nil)

(defun keylogger-autosave ()
  "Start the autosaver to save every key press"
  (interactive)
  (setq keylogger-timer
        (run-with-idle-timer keylogger-autosave-frequency t
                             'keylogger-save)))

(defun keylogger-save ()
  (interactive)

  (let ((file keylogger-filename))
    (with-temp-buffer
      (print keylogger-times   (current-buffer))
      (print keylogger-counts  (current-buffer))
      (print keylogger-squares (current-buffer))
      (when (file-writable-p file)
        (write-region (point-min)
                      (point-max)
                      file)))))

(defun keylogger-load ()
  (interactive)

  (let ((file keylogger-filename))
    (with-temp-buffer
      (insert-file-contents file)
      (setq keylogger-times   (read (current-buffer)))
      (setq keylogger-counts  (read (current-buffer)))
      (setq keylogger-squares (read (current-buffer))))))
