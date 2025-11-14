#!/bin/bash

# Check if current pane is zoomed
zoomed=$(tmux display-message -p '#{window_zoomed_flag}')

if [ "$zoomed" -eq 1 ]; then
    # If zoomed, unzoom the current pane
    tmux resize-pane -Z
    tmux select-pane -t !
else
    # If not zoomed, zoom the current pane
    tmux select-pane -t !
    tmux resize-pane -Z
fi