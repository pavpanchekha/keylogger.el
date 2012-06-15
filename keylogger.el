; 256 * Last-key + Next-key

(defcustom every-key-press-filename "~/.emacs.d/keys"
  "File in which to store the state of all of the key strokes
  you've ever made.  Must be writable and readable.")

(defcustom every-key-press-autosave-frequency (* 60 15)
  "How often to auto-save the collected data on key pair stroke
  frequencies.  Saved to `every-key-press-filename`.")

(defvar *key-press-table*  (make-vector (* 96 96) 0.0)
  "This table stores the total seconds used in the
  inter-keystroke timing for each pair of keys.  The key
  transition i -> j has index (i - 32) * 96 + (j - 32); thus
  export to JavaScript is not particularly heavy-weight (10,000
  or so elements)")
(defvar *key-press-counts* (make-vector (* 96 96) 0)
  "This table stores the total number of times each key
  transition has occured.  The indexing scheme is the same as
  that for `*key-press-counts*`")

; TODO: Currently unused
(defvar *key-press-expsq*  (make-vector (* 96 96) 0)
  "This table stores the total squared number of seconds used in
  the inter-keystroke timing for each pair of keys; it is used in
  computing the standard deviation of each key press")
(defvar *key-press-expcb*  (make-vector (* 96 96) 0)
  "This table stores the total cubed number of seconds used in
  the inter-keystroke timing for each pair of keys; it is used in
  computing the skew of each key press")

(defvar *key-press-last* 0)
(defvar *key-press-last-time* 0)

(defun every-key-press-to-idx (last next)
  (+ (* (- last 32) 96) (- next 32)))

(defun record-every-key-press ()
  (let ((char last-command-event)
        (time (current-time))
        (last-char *key-press-last*)
        (last-time *key-press-last-time*))
    (setq *key-press-last* char)
    (setq *key-press-last-time* time)
    (when (and (listp last-time) (= (car last-time) (car time))
               (>= last-char 32) (>= char 32)
               (< last-char 256) (< char 256))
      (let* ((last-time (cdr last-time)) (time (cdr time))
             (sd (- (car time)  (car last-time))))
        (when (< sd 2)
          (let* ((md (- (cadr time) (cadr last-time)))
                 (td (+ sd (/ (float md) 1000000.0)))
                 (entry (every-key-press-to-idx last-char char))
                 (entry-sum (aref *key-press-table* entry))
                 (entry-count (aref *key-press-counts* entry)))
            (aset *key-press-table* entry (+ entry-sum td))
            (aset *key-press-counts* entry (+ entry-count 1))))))))

(defun remember-every-key-press ()
  (interactive)
  (add-hook 'post-self-insert-hook #'record-every-key-press))

(require 'cl)

(defun forget-every-key-press ()
  (interactive)
  (setq *key-press-table*  (make-vector (* 96 96) 0.0))
  (setq *key-press-counts* (make-vector (* 96 96) 0)))

(defun summarize-every-key-press ()
  (interactive)

  (let ((res (loop for i from 0 below (* 96 96)
                   when (/= (aref *key-press-counts* i) 0)
                   collect (cons (concat (char-to-string (+ (/ i 96) 32))
                                         (char-to-string (+ (% i 96) 32)))
                                 (/ (aref *key-press-table* i)
                                    (aref *key-press-counts* i))))))
    (sort res (lambda (x y) (< (cdr x) (cdr y))))))

(defvar every-key-press-timer nil)

(defun autosave-every-key-press ()
  "Start the autosaver to save every key press"
  (interactive)
  (setq every-key-press-timer
        (run-with-idle-timer every-key-press-autosave-frequency t
                             'save-every-key-press)))

(defun save-every-key-press ()
  (interactive)

  (let ((file every-key-press-filename))
    (with-temp-buffer
      (print *key-press-table*  (current-buffer))
      (print *key-press-counts* (current-buffer))
      (when (file-writable-p file)
        (write-region (point-min)
                      (point-max)
                      file)))))

(defun load-every-key-press ()
  (interactive)

  (let ((file every-key-press-filename))
    (with-temp-buffer
      (insert-file-contents file)
      (setq *key-press-table* (read (current-buffer)))
      (setq *key-press-counts* (read (current-buffer))))))
