# Vim Cheat Sheet

## Table of Contents
- [Navigation](#navigation)
- [Editing](#editing)
- [Text Objects & Motions](#text-objects--motions)
- [Search & Replace](#search--replace)
- [Visual Mode](#visual-mode)
- [Undo & Redo](#undo--redo)
- [File Operations](#file-operations)
- [Resources](#resources)

---

## Navigation

### Basic Cursor Movement
| Command | Description |
|---------|-------------|
| `h` | Move cursor left by one character |
| `j` | Move cursor down by one character |
| `k` | Move cursor up by one character |
| `l` | Move cursor right by one character |
| `3j` | Move 3 (or n) lines down, similar for other directions |

### Word Movement
| Command | Description |
|---------|-------------|
| `w` | Move to start of next word (excluding punctuation) |
| `W` | Move to start of next WORD (including punctuation) |
| `e` | Move to end of next word (excluding punctuation) |
| `E` | Move to end of next WORD (including punctuation) |
| `b` | Move to start of previous word |
| `B` | Move to start of previous WORD |
| `ge` | Move to end of previous word |
| `3w` | Move 3 (or n) words ahead, similar for other commands |

### Line Movement
| Command | Description |
|---------|-------------|
| `0` | Move to beginning of line |
| `^` | Move to first non-whitespace character of line |
| `$` | Move to end of line |
| `g_` | Move to last non-whitespace character of line |
| `G` | Move to end of file (EOF) |

### Jump Movement
| Command | Description |
|---------|-------------|
| `(` | Jump to previous sentence |
| `)` | Jump to next sentence |
| `{` | Jump to previous paragraph |
| `}` | Jump to next paragraph |
| `%` | Jump between matching brackets `[]`, `{}`, `()` |
| `'.` | Jump to line of last modification |
| `` `. `` | Jump to exact position of last modification |
| `Ctrl+o` | Jump back to previous location (jump list backwards) |
| `Ctrl+i` | Jump forward to next location (jump list forwards) |

**Tip:** `Ctrl+o` and `Ctrl+i` let you retrace your movements through the file, useful after jumping around with searches or go-to commands.

### Screen Position Movement
| Command | Description |
|---------|-------------|
| `H` | Move cursor to **H**igh (top) of screen |
| `M` | Move cursor to **M**iddle of screen |
| `L` | Move cursor to **L**ow (bottom) of screen |

### Page Scrolling
| Command | Description |
|---------|-------------|
| `Ctrl+b` | Page up (back) |
| `Ctrl+f` | Page down (forward) |
| `5Ctrl+b` | Move 5 (or n) pages up |
| `50gg` | Jump to line 50 (or n) |
| `50G` | Jump to line 50 (or n) |
| `5%` | Move to 5% position in file (e.g., line 25 in 500-line file) |

### Screen Positioning
| Command | Description |
|---------|-------------|
| `zt` | Move current line to **t**op of screen |
| `zz` | Move current line to **z**enter (middle) of screen |
| `zb` | Move current line to **b**ottom of screen |
| `Lzz` | Bring bottom line to middle of screen |
| `Hzz` | Bring top line to middle of screen |
| `Lzt` | Bring bottom line to top of screen |
| `/pattern` then `zz` | Center search result on screen |

**Tip:** `zz` or `zt` is useful when search results appear at bottom of screen and you want to see lines below it.

### Scrolling Without Moving Cursor
| Command | Description |
|---------|-------------|
| `Ctrl+e` | Scroll screen up without moving cursor |
| `Ctrl+y` | Scroll screen down without moving cursor |
| `5Ctrl+e` | Scroll 5 lines up without moving cursor |
| `5Ctrl+y` | Scroll 5 lines down without moving cursor |
| `Ctrl+d` | Move half screen down (cursor maintains relative position) |
| `Ctrl+u` | Move half screen up (cursor maintains relative position) |

---

## Editing

### Insert & Delete Modes
| Command | Description |
|---------|-------------|
| `i` | Insert at current cursor position |
| `I` | Insert at beginning of line |
| `a` | Insert (append) after current cursor position |
| `A` | Insert (append) at end of line |
| `o` | Insert newline below current line |
| `O` | Insert newline above current line |
| `s` | Delete current character and start inserting (substitute) |
| `S` | Delete current line and start inserting (same as `cc`) |
| `cc` | Change (delete and insert) current line |
| `cw` | Change current word |
| `C` | Change from cursor to end of line |

### Operations with Motions

**Pattern:** `{operator}{motion}`

| Operator | Description |
|----------|-------------|
| `y{motion}` | Yank (copy) block selected by motion |
| `d{motion}` | Delete block selected by motion |
| `c{motion}` | Change (delete and insert) block selected by motion |
| `v{motion}` | Visually select block selected by motion |

### Yank (Copy) Operations
| Command | Description |
|---------|-------------|
| `yy` | Yank current line |
| `yw` | Yank current word |
| `y5w` | Yank next 5 (or n) words |
| `yW` | Yank current WORD (including punctuation) |
| `yb` | Yank previous word |
| `y5b` | Yank previous 5 (or n) words |
| `yB` | Yank previous WORD |
| `yj` | Yank current and next line |
| `y5j` | Yank current and next 5 (or n) lines |
| `yk` | Yank current and previous line |
| `y5k` | Yank current and previous 5 (or n) lines |
| `y0` | Yank from cursor to beginning of line |
| `y$` | Yank from cursor to end of line |
| `y^` | Yank from cursor to first non-whitespace character |
| `yg_` | Yank from cursor to last non-whitespace character |

### Delete Operations
| Command | Description |
|---------|-------------|
| `dd` | Delete current line |
| `D` | Delete from cursor to end of line |
| `dw` | Delete current word |
| `db` | Delete previous word |
| `dj` | Delete current and next line |
| `d5j` | Delete current and next 5 (or n) lines |
| `dk` | Delete current and previous line |
| `d5k` | Delete current and previous 5 (or n) lines |
| `dpp` | Swap current line and next line |

### Change Operations
| Command | Description |
|---------|-------------|
| `cc` | Change current line |
| `C` | Change from cursor to end of line |
| `cw` | Change current word |
| `c5w` | Change next 5 (or n) words |

### Paste Operations
| Command | Description |
|---------|-------------|
| `p` | Paste after cursor position |
| `P` | Paste before cursor position |

### Text Formatting
| Command | Description |
|---------|-------------|
| `>>` | Indent current line right |
| `>5j` | Indent current and next 5 (or n) lines right |
| `>5k` | Indent current and previous 5 (or n) lines right |
| `<<` | Indent current line left |
| `<5j` | Indent current and next 5 (or n) lines left |
| `<5k` | Indent current and previous 5 (or n) lines left |
| `==` | Auto-align current line |
| `=5j` or `5==` | Auto-align current and next 5 (or n) lines |
| `=5k` | Auto-align current and previous 5 (or n) lines |

---

## Text Objects & Motions

### Understanding Text Objects

Text objects can be combined with operators (`y`, `d`, `c`, `v`) to perform actions on structured text.

**Pattern:** `{operator}{i/a}{text-object}`
- `i` = "inner" (excludes delimiters/whitespace)
- `a` = "around" (includes delimiters/whitespace)

### Inner Text Objects (`i`)
| Text Object | Description |
|-------------|-------------|
| `iw` | Inner word |
| `iW` | Inner WORD (bigger word) |
| `it` | Inner tag (e.g., `<head>...</head>`) |
| `i"` | Inner double-quoted text |
| `i'` | Inner single-quoted text |
| `` i` `` | Inner backticked text |
| `is` | Inner sentence |
| `ip` | Inner paragraph |
| `ib` or `i(` or `i)` | Inner contents of `(...)` block |
| `iB` or `i{` or `i}` | Inner contents of `{...}` block |
| `i[` or `i]` | Inner contents of `[...]` block |
| `i<` or `i>` | Inner contents of `<...>` block |

### Around Text Objects (`a`)
| Text Object | Description |
|-------------|-------------|
| `aw` | A word, including trailing space |
| `aW` | A WORD, including trailing space |
| `at` | A tag (e.g., `<head>...</head>` including tags) |
| `a"` | A double-quoted string, including quotes |
| `a'` | A single-quoted string, including quotes |
| `` a` `` | A backticked string, including backticks |
| `as` | A sentence |
| `ap` | A paragraph |
| `ab` or `a(` or `a)` | A `(...)` block, including parentheses |
| `aB` or `a{` or `a}` | A `{...}` block, including braces |
| `a[` or `a]` | A `[...]` block, including brackets |
| `a<` or `a>` | A `<...>` block, including angle brackets |

### Text Object Examples

#### Change Operations
| Command | Description |
|---------|-------------|
| `ciw` | Change inner word |
| `ciW` | Change inner WORD |
| `cit` | Change inner tag contents |
| `ci"` | Change text inside double quotes |
| `cib` or `ci(` | Change contents inside `(...)` |
| `ci{` | Change contents inside `{...}` |
| `` ci` `` | Change contents inside backticks |
| `caB` or `ca{` | Change block including `{...}` braces |
| `ca>` or `ca<` | Change tag including `<...>` brackets |

**Note:** Text changed with `c` can be pasted elsewhere using `p` or `P`.

#### Yank Operations
| Command | Description |
|---------|-------------|
| `yiw` | Yank inner word |
| `yiW` | Yank inner WORD |
| `yit` | Yank inner tag |
| `yi"` | Yank text inside double quotes |
| `yi'` | Yank text inside single quotes |
| `yis` | Yank inner sentence |
| `yip` | Yank inner paragraph |
| `yi(` or `yi)` | Yank text inside `(...)` |
| `yi[` or `yi]` | Yank text inside `[...]` |
| `yaw` | Yank word including trailing spaces |
| `ya)` or `ya(` | Yank block including `(...)` parentheses |

#### Delete Operations
| Command | Description |
|---------|-------------|
| `diw` | Delete inner word |
| `diW` | Delete inner WORD |
| `di'` | Delete text inside single quotes |
| `di]` or `di[` | Delete text inside `[...]` |
| `das` | Delete a sentence |
| `daB` | Delete block including `{...}` braces |

**Note:** Deleted text can be pasted elsewhere using `p` or `P`.

#### Visual Selection
| Command | Description |
|---------|-------------|
| `viw` | Visually select inner word |
| `vi"` | Visually select text within double quotes |
| `vi}` | Visually select contents inside `{...}` |
| `va}` | Visually select block including `{...}` |
| `vap` | Visually select paragraph |

---

## Search & Replace

### Character Search on Line
| Command | Description |
|---------|-------------|
| `f<char>` | **F**ind next `<char>` on line, cursor on character |
| `t<char>` | Find next `<char>` on line, cursor **t**ill (before) character |
| `F<char>` | **F**ind previous `<char>` on line, cursor on character |
| `T<char>` | Find previous `<char>` on line, cursor **t**ill (after) character |
| `;` | Repeat last `f`/`t`/`F`/`T` command (forward) |
| `,` | Repeat last `f`/`t`/`F`/`T` command (backward) |

### Pattern Search in File
| Command | Description |
|---------|-------------|
| `/<pattern>` | Search forward for pattern |
| `?<pattern>` | Search backward for pattern |
| `n` | Jump to next search result |
| `N` | Jump to previous search result |
| `/\%V<pattern>` | Search within last visual selection (`\%V` matches visual area) |

### Delete with Search
| Command | Description |
|---------|-------------|
| `df<char>` | Delete till next `<char>` (inclusive) |
| `dt<char>` | Delete till next `<char>` (exclusive) |
| `dF<char>` | Delete till previous `<char>` (inclusive) |
| `dT<char>` | Delete till previous `<char>` (exclusive) |
| `d/<pattern>` | Delete till next occurrence of pattern |
| `d?<pattern>` | Delete till previous occurrence of pattern |

### Change with Search
| Command | Description |
|---------|-------------|
| `cf<char>` | Change till next `<char>` (inclusive) |
| `ct<char>` | Change till next `<char>` (exclusive) |
| `cF<char>` | Change till previous `<char>` (inclusive) |
| `cT<char>` | Change till previous `<char>` (exclusive) |
| `c/<pattern>` | Change till next occurrence of pattern |
| `c?<pattern>` | Change till previous occurrence of pattern |

---

## Visual Mode

### Visual Selection
| Command | Description |
|---------|-------------|
| `v` | Start character-wise visual mode |
| `V` | Start line-wise visual mode |
| `Ctrl+v` | Start block-wise (column) visual mode |
| `v$` | Visually select from cursor to end of line |
| `gv` | Reselect last visual selection |
| `o` | Move to other end of visual selection |

### Visual Mode Operations
Once in visual mode, use navigation keys to expand selection, then:
- `y` - Yank (copy) selection
- `d` - Delete selection
- `c` - Change selection
- `>` - Indent right
- `<` - Indent left
- `=` - Auto-indent

**Tip:** Press `v` and select lines, then press `v` again to search within visual selection using `/\%V<pattern>`.

---

## Undo & Redo

| Command | Description |
|---------|-------------|
| `u` | Undo last change |
| `4u` | Undo last 4 (or n) changes |
| `Ctrl+r` | Redo |
| `4Ctrl+r` | Redo last 4 (or n) changes |
| `:undo` | Undo (command mode) |
| `:redo` | Redo (command mode) |

---

## File Operations

### Saving & Exiting
| Command | Description |
|---------|-------------|
| `:w` | Write (save) file |
| `:w !diff % -` | See changes before saving file |
| `:wq` or `:x` or `ZZ` | Write and quit |
| `:q` | Quit (fails if unsaved changes) |
| `:q!` or `ZQ` | Quit without saving |
| `:wa` | Write all open buffers |
| `:wqa` | Write all and quit |

---

## Resources

### Useful Links
- [Mastering Vim Commands - The Ultimate List](https://www.designbombs.com/mastering-vim-commands-the-ultimate-list/)
- [Vim Commands Gist by hansrajdas](https://gist.github.com/hansrajdas/6520d74ac3251552e66a76f2f32b4bdd)
- [Vim A to Z, Literally](https://dev.to/prodopsio/vim-a-to-z-literally-1iah)

---

## Quick Tips

- **Combining Operators & Motions:** Most commands follow the pattern `{operator}{count}{motion}` or `{count}{operator}{motion}`
  - Example: `d3w` = delete 3 words, `3dd` = delete 3 lines
  
- **Repeating Commands:** Press `.` to repeat the last change command

- **Command Mode:** Press `:` to enter command mode for advanced operations

- **Getting Help:** Type `:help <command>` for detailed documentation
