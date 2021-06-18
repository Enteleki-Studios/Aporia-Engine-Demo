#!/bin/sh

tmux new-session -d -s ECS

tmux rename-window 'VIM'
tmux send-keys "cd $PWD" 'C-m' 'C-l'
tmux split-window -h
tmux send-keys "cd $PWD" 'C-m' 'C-l'
tmux split-window -v
tmux send-keys "cd $PWD" 'C-m' 'C-l'

tmux send-keys "pods node ." 'C-m'
tmux send-keys "npm start" 'C-m'

tmux select-window -t 1
tmux select-pane -t 1
tmux send-keys 'e' 'C-m'

tmux -2 attach-session -t ECS
