# Tmux Cheat Sheet

## Table of Contents
- [Sessions](#sessions)
- [Windows](#windows)
- [Panes](#panes)
- [Navigation & Scrolling](#navigation--scrolling)
- [Copy Mode & Buffers](#copy-mode--buffers)
- [Layouts](#layouts)
- [Configuration](#configuration)
- [Resources](#resources)
- [Windows Terminal Integration](#windows-terminal-integration)
---

## Sessions

### Session Management (Command Line)
| Command | Description |
|---------|-------------|
| `tmux ls` | List all available sessions |
| `tmux new -s <session-name>` | Create new session with name |
| `tmux attach -t <session-name>` | Attach to an existing session |
| `tmux kill-session -t <session-name>` | Kill a specific session |
| `tmux attach -t <session-name>:<window-id>` | Attach to specific session and window |

### Session Management (Inside Tmux)
| Keys | Description |
|------|-------------|
| `leader :new` | Create new session |
| `leader s` | Choose session from list |
| `leader Shift+(` | Move to previous session |
| `leader Shift+)` | Move to next session |
| `leader Shift+L` | Switch to last (previously used) session |
| `leader Shift+$` | Rename current session |
| `leader d` | Detach from current session |

---

## Windows

### Window Management
| Keys | Description |
|------|-------------|
| `leader c` | Create new window |
| `leader ,` | Rename current window |
| `leader w` | Choose window from list |
| `leader <0-9>` | Switch to window by number |
| `leader p` | Switch to previous window |
| `leader n` | Switch to next window |
| `leader b` | `Custom key` Switch to last (previously used) window |
| `leader Shift+&` | Kill current window |

### Window Commands
| Command | Description |
|---------|-------------|
| `move-window -s <session-name>` | Move window to another session, run cmd from session where you want session to appear |
| `move-window -s <session-name>:<window-index>` | Move specific window to session |
| `move-window -t <window-id>` | Change window ID number |
| `swap-window -t <window-id>` | Swap current window with target |
| `swap-window -s <source> -t <target>` | Swap two windows by number |

---

## Panes

### Pane Creation & Splitting
| Keys | Description |
|------|-------------|
| `leader Shift+%` | Split pane vertically (right split) |
| `leader Shift+"` | Split pane horizontally (bottom split) |
| `leader !` | Break pane into new window |

### Pane Navigation & Management
| Keys | Description |
|------|-------------|
| `leader <Arrow Keys>` | Move between panes (split screen) |
| `leader h,j,k,l` | `Custom key` Move between panes (split screen) |
| `leader q` | Display pane numbers briefly |
| `leader x` | Kill current pane |
| `leader z` | Zoom/unzoom pane (toggle fullscreen) |
| `leader Shift+{` | Move pane to previous position |
| `leader Shift+}` | Move pane to next position |
| `leader, Alt + <Arrow Key>` | `Custom key` Resize pane (hold Alt key and press navigation key) |
| `leader, Alt + h,j,k,l` | `Custom key` Resize pane (hold Alt key and press navigation key) |

### Join Pane Commands
| Command | Description |
|---------|-------------|
| `join-pane -t :<window-id>` | Join pane to target window |
| `join-pane -t :<window-id> -h` | Join pane vertically |
| `join-pane -t :<window-id> -v` | Join pane horizontally |

### Pane Capture Commands
| Command | Description |
|---------|-------------|
| `:capture-pane` or `:capturep` | Capture pane content to buffer |
| `:capture-pane -S -100` | Capture last 100 lines |
| `tmux capture-pane -t <pane-id> -pS - > file.txt` | Capture all content from the specified pane and save it to file.txt. Run this command from the current window; the target pane can be different |
| `tmux capture-pane -t <pane-id> -pS -100 > file.txt` | Capture last 100 lines to file |

---

## Navigation & Scrolling

### Scroll Mode
| Keys | Description |
|------|-------------|
| `leader [` | Enter copy/scroll mode (navigate with arrow keys, or vi keys) |
| `q` | Exit copy/scroll mode |

### Searching in Buffer

| Keys | Description |
|------|-------------|
| `leader [` then `Ctrl+s` | Start search in copy mode |
| `n` | Next search match |
| `Shift+n` | Previous search match |

**Note:** In Vi mode, use `/` to search forward and `?` to search backward.

---

## Copy Mode & Buffers

### Copy & Paste
| Keys | Description |
|------|-------------|
| `leader [` | Enter copy mode |
| `leader ]` | Paste copied text |

### Buffer Management
| Command/Keys | Description |
|--------------|-------------|
| `:list-buffers` | List all saved buffers |
| `:set-buffer <new-name>` | Create buffer with name |
| `:set-buffer -b <index> <new-name>` | Create buffer with index and name |
| `:paste-buffer -b <index>` | Paste buffer by index |
| `bind-key P run-shell "tmux paste-buffer -b 9"` | Key binding for pasting specific buffer |
| `leader #` | List paste buffers of session |
| `leader -` | Delete buffer |
| `:show-buffer` or `:showb` | Display buffer content |

**Note:** Use this command to delete all buffers `tmux list-buffers | awk -F: '{print $1}' | xargs -n1 tmux delete-buffer -b`

### Vi Mode Configuration
| Command | Description |
|---------|-------------|
| `setw -g mode-keys vi` | Enable vi mode for copy (use 'y' to yank) |

**Resource:** [The Easy Way to Copy Text in Tmux](https://dev.to/iggredible/the-easy-way-to-copy-text-in-tmux-319g)

### Custom Tips & Tricks

**Create Named Buffers for Common Commands:**
```bash
# Create buffers with frequently used commands
set-buffer -b vim "so ~/.vimrc"
set-buffer -b alias "source ~/.alias"

# Bind keys to paste specific buffers
bind-key v run-shell "tmux paste-buffer -b vim"
bind-key a run-shell "tmux paste-buffer -b alias"
```

**Usage:** Press `Ctrl+b v` to paste vim config reload command, or `Ctrl+b a` to paste alias reload command. This is useful for storing and quickly accessing frequently used commands.

---

## Layouts

### Layout Commands
| Keys | Description |
|------|-------------|
| `leader Alt+1` | Select even-horizontal layout |
| `leader Alt+2` | Select even-vertical layout |

---

## Configuration

### History Buffer
| Command | Description |
|---------|-------------|
| `set-option history-limit 5000` | Set scroll-back limit for current pane |
| `tmux set-option -g history-limit 5000` | Set scroll-back limit globally (-g flag); applied for new sessions aswell |
| `echo "set -g history-limit 5000" >> ~/.tmux.conf` | Set permanently in config file |

### Display & UI Settings
| Command | Description |
|---------|-------------|
| `set -g mouse on` | Enable mouse support |
| `leader t` | Show system time |
| `set-window-option -g aggressive-resize on` | Enable aggressive resize |
| `set -g status-right '#(TZ="US/Pacific" date + "%%h %%d %%H:%%M")'` | Show time and date in status bar |

---

## Windows Terminal Integration

### SSH + Tmux Connection Profile

To create a persistent SSH connection with tmux in Windows Terminal:

**Command:**
```powershell
%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe ssh -X -t dmanish@us01odcvde21813 tmux new -As dmanish
```

**Setting up in Windows Terminal:**

1. Open Windows Terminal Settings (`Ctrl+,`)
2. Click "Add a new profile" or edit existing profile
3. Set the following:
   - **Name:** `Remote Tmux (dmanish)`
   - **Command line:** 
     ```
     %SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe ssh -X -t dmanish@us01odcvde21813 tmux new -As dmanish
     ```
   - **Starting directory:** (optional)
   - **Icon:** (optional)

4. Save the profile

**What it does:**
- `-X`: Enables X11 forwarding
- `-t`: Forces pseudo-terminal allocation
- `tmux new -As dmanish`: Creates new session named "dmanish" or attaches if already exists

**Usage:** Select the profile from Windows Terminal dropdown to instantly connect to your remote tmux session.

---

## Resources

### Help & Key Bindings
| Keys/Command | Description |
|--------------|-------------|
| `leader ?` | Show all keyboard shortcuts |
| `:lsk` | List all key bindings |

### Useful Links
- [Tmux Buffer Guide](https://www.fosslinux.com/106189/how-to-jump-between-tmux-buffers-like-a-pro.htm)
- [Copy Text in Tmux](https://dev.to/iggredible/the-easy-way-to-copy-text-in-tmux-319g)
- [Clean tmux cheat-sheet](https://gist.github.com/Bekbolatov/6840069e51382965fdad)

---

## Quick Reference

**Prefix Key:** All commands start with `leader` (default prefix)

**Common Workflow:**
1. Create session: `tmux new -s myproject`
2. Split panes: `leader Shift+%` or `leader Shift+"`
3. Create windows: `leader c`
4. Navigate: `leader <Arrow Keys>` (panes) or `leader <number>` (windows)
5. Detach: `leader d`
6. Reattach: `tmux attach -t myproject`
