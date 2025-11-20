# Terminal Keyboard Shortcuts

## Table of Contents
- [Cursor Movement](#cursor-movement)
- [Text Editing & Deletion](#text-editing--deletion)
- [Command History](#command-history)
- [Terminal Control](#terminal-control)
- [Resources](#resources)

---

## Cursor Movement

### Character-Level Movement
| Shortcut | Description |
|----------|-------------|
| `Ctrl+a` | Move to **a**ll the way to beginning of line |
| `Ctrl+e` | Move to **e**nd of line |
| `Ctrl+b` | Move **b**ack one character |
| `Ctrl+f` | Move **f**orward one character |
| `Ctrl+x` | Toggle between current cursor position and beginning of line |

### Word-Level Movement
| Shortcut | Description |
|----------|-------------|
| `Alt+f` | Move cursor **f**orward one word |
| `Alt+b` | Move cursor **b**ack one word |

**Tip:** Word-level movement is much faster when navigating long commands.

---

## Text Editing & Deletion

### Character Deletion
| Shortcut | Description |
|----------|-------------|
| `Ctrl+h` | Delete one character to the left (like Backspace) |
| `Ctrl+d` | Delete one character to the right (like Delete key) |

### Word & Line Deletion
| Shortcut | Description |
|----------|-------------|
| `Ctrl+w` | Delete backward to the beginning of word |
| `Ctrl+k` | Delete (**k**ill) from cursor to end of line |
| `Ctrl+u` | Delete entire line (from cursor to beginning) |
| `Alt+d` | Delete  **f**orward one word |

---

## Command History

### History Navigation
| Shortcut | Description |
|----------|-------------|
| `Ctrl+p` | View **p**revious command in history (or `↑`) |
| `Ctrl+n` | View **n**ext command in history (or `↓`) |
| `Ctrl+r` | **R**everse search through command history |

**Tip:** Use `Ctrl+r` and start typing to search your command history interactively. Press `Ctrl+r` again to cycle through matches.

---

## Terminal Control

### Output Control
| Shortcut | Description |
|----------|-------------|
| `Ctrl+s` | Pause (freeze) terminal output |
| `Ctrl+q` | Resume terminal output after pause |
| `Ctrl+c` | Cancel/interrupt current command |
| `Ctrl+z` | Suspend current process (send to background) |
| `Ctrl+l` | Clear screen (alternative to `clear` command) |

**Note:** If your terminal appears frozen, try `Ctrl+q` - you may have accidentally pressed `Ctrl+s`.

---

## Resources

### Useful Links
- [Terminal Keyboard Shortcuts Collection](https://keycombiner.com/collections/terminal/)