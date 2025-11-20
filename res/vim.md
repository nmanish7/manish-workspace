# Vim Advanced Cheat Sheet

## Table of Contents
- [File Information & Registers](#file-information--registers)
- [Writing Yanked Text to File](#writing-yanked-text-to-file)
- [Vimdiff](#vimdiff)
- [Registers & Delete vs Cut](#registers--delete-vs-cut)
- [Syntax Highlighting](#syntax-highlighting)

---

## File Information & Registers

### Current File Information

The register `%` contains the name of the current file.

| Command | Description |
|---------|-------------|
| `:echo @%` | Show directory/name of file |
| `:echo expand('%:t')` | Show name of file ('tail') |
| `:echo expand('%:p')` | Show full path |
| `:echo expand('%:p:h')` | Show directory containing file ('head') |
| `:put =expand('%:p')` | Insert full path of current file at cursor |

**Examples:**
```vim
:echo @%                " outputs: directory/filename.txt
:echo expand('%:t')     " outputs: filename.txt
:echo expand('%:p')     " outputs: /full/path/to/directory/filename.txt
:echo expand('%:p:h')   " outputs: /full/path/to/directory
```

---

## Writing Yanked Text to File

### Write Yanked Content to External File

**Command:**
```vim
:call writefile(split(getreg('"'), '\n'), '/tmp/myFile')
```

This writes the contents of the default register `"` to `/tmp/myFile`.

### Create Keyboard Shortcut

Add this to your `.vimrc` or execute in vim:

```vim
nnoremap <C-k> :call writefile(split(getreg('"'), '\n'), '/tmp/myFile')<CR>
```

Now pressing `Ctrl+k` will write yanked text to `/tmp/myFile`.

---

## Vimdiff

### Starting Vimdiff

#### From Command Line
```bash
vimdiff file1 file2
```

#### From Within Vim
```vim
:tabe file1
:vert diffsplit file2
```

Or to diff all windows:
```vim
:windo diffthis
```

### Vimdiff Navigation
| Command | Description |
|---------|-------------|
| `]c` | Jump to next block with differences |
| `[c` | Jump to previous block with differences |

### Vimdiff Operations
| Command | Description |
|---------|-------------|
| `do` | **D**iff **O**btain - bring changes from other file to current file |
| `dp` | **D**iff **P**ut - send changes from current file to other file |
| `zo` | **Z**-fold **O**pen - unfold/unhide text |
| `zc` | **Z**-fold **C**lose - refold/rehide text |
| `zr` | **Z**-fold **R**educe - unfold both files completely |
| `zm` | **Z**-fold **M**ore - fold both files completely |
| `:diffupdate` | Re-scan files for changes |

### Vimdiff with Visual Mode
| Command | Description |
|---------|-------------|
| `:'<,'>diffget` | Get diff changes for visual selection |
| `:'<,'>diffput` | Put diff changes for visual selection |

### Show Only Differences

To display only the differences without context lines:

**From command line:**
```bash
vimdiff -c 'set diffopt=filler,context:0' file1 file2
```

**From within vimdiff:**
```vim
:set diffopt=filler,context:0
```

To restore normal view with context:
```vim
:set diffopt=filler,context:3
```

---

## Registers & Delete vs Cut

### How to Delete (Not Cut) in Vim

**The Problem:** When you delete with `dd`, it overwrites the default register, so you can't paste what you yanked earlier.

**Solution:** Use the yank register `"0` which is not overwritten by delete operations.

#### Using the Black Hole Register
The black hole register `"_` discards content without affecting other registers:
```vim
"_dd    " Delete line without affecting registers
```

#### Using the Yank Register (Better Solution)
The yank register `"0` preserves your yanked content:

**Example workflow:**
```vim
yy      " Yank line (stored in both "" and "0)
dd      " Delete another line (overwrites "")
"0p     " Paste from yank register "0 (preserved!)
```

### Common Registers
| Register | Description |
|----------|-------------|
| `""` | Default (unnamed) register - overwritten by delete/yank |
| `"0` | Yank register - only written by yank commands |
| `"_` | Black hole register - discards everything |
| `"%` | Current file name |
| `"*` | System clipboard (X11 primary) |
| `"+` | System clipboard (X11 clipboard) |

**Usage Examples:**
```vim
"ayy    " Yank line into register 'a'
"ap     " Paste from register 'a'
"_dd    " Delete without affecting registers
"+yy    " Yank to system clipboard
"+p     " Paste from system clipboard
```

---

## Syntax Highlighting

### Set File Type for Syntax Highlighting

When working with files that don't have standard extensions:

```vim
:set filetype=sh        " Enable shell script syntax
:set filetype=python    " Enable Python syntax
:set filetype=javascript " Enable JavaScript syntax
:set filetype=markdown  " Enable Markdown syntax
```

**View current file type:**
```vim
:set filetype?
```

**Auto-detect file type:**
```vim
:filetype detect
```

---

## Quick Reference

### Key Concepts

1. **Registers** - Vim's clipboard system with multiple storage locations
2. **Vimdiff** - Built-in tool for comparing and merging files
3. **File Information** - Access file paths and metadata through registers and expand()
4. **Black Hole Register** - Delete without affecting other registers using `"_`
5. **Yank Register** - Preserve yanked content even after deleting with `"0`

### Common Workflows

**Compare two files:**
```vim
:vert diffsplit otherfile.txt
:windo diffthis
```

**Yank, delete, then paste the yanked content:**
```vim
yy      " Yank
dd      " Delete (somewhere else)
"0p     " Paste the yanked content (not the deleted one)
```

**Write selection to external file:**
```vim
:'<,'>w /tmp/output.txt
```

Or with yanked content:
```vim
:call writefile(split(getreg('"'), '\n'), '/tmp/output.txt')
```