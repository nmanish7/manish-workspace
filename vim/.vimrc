" ------------------------------------------------------------
" Author: Manish Das
" Vim Version Support: 9.1.741
" File: ~/.vimrc
" Created: 2025-11-14
" Description: Personal editing configuration
" ------------------------------------------------------------

" [ Basic Settings ] ---------------------------------------------
set nocompatible                    | " This is used to remove 'ESC[?4m' error whenever we open the vim
let &term=&term                     | " to avoid 'TERM environment variable not set' error
let colorscheme_name = ""           | " Initialize colorscheme_name variable

" [ Colorscheme Setting ] ----------------------------------------
if v:version >= 900                             | " Set colorscheme based on Vim version
    let colorscheme_name = "retrobox"
else
    let colorscheme_name = "murphy"
endif

" [ Leader Key Setting ] ----------------------------------------
let mapleader = "\<Space>"              | " Set the leader key to space

" [ Vundle Package Manager Setup ]  ----------------------------------------

" Download plug-ins to the ~/.vim/plugged/ directory

" Set the runtime path to include Vundle and initialize
set rtp+=~/.vim/bundle/Vundle.vim                   | " Set the runtime path to include Vundle

" This is for custom packages, like fzf, rg, xclip, etc.
set rtp+=~/custompackages/packages/                 | " Set the runtime path to include custom packages

call vundle#begin('~/.vim/plugged')                 | " call vundle#begin('~/.vim/plugged')

Plugin 'VundleVim/Vundle.vim'                       | " Let Vundle manage Vundle
Plugin 'laktak/tome'                                | " Tome Plugin
Plugin 'rickhowe/diffchar.vim.git'                  | " Plugin diffchar.vim
Plugin 'liuchengxu/vim-which-key'                   | " Plugin vim-which key

call vundle#end()                                   | " call vundle#end()
" ----------------------------------------[ End Vundle Section ]-----------

" [ Basic Vim Configuration ] ----------------------------------------
syntax on                                               | " Enable syntax highlighting
se nu                                                   | " Enable line numbers 
set relativenumber                                      | " Enable relative line numbers   
" set ttymouse=xterm2                                   | " Setting Mouse for Tmux
" set mouse=a                                           | " Enable mouse drag on window splits
set tabstop=4                                           | " Set tab width to 4 spaces   
set shiftwidth=4                                        | " Set indentation width to 4 spaces
set expandtab                                           | " Use spaces instead of tabs
set incsearch                                           | " Enable incremental search
set hlsearch                                            | " Enable highlight search
set background=dark                                     | " Set BG to dark
windo set wrap                                          | " Enable line wrapping
execute "colorscheme  " . colorscheme_name              | " Set colorscheme based on Vim version


" [ Setting Backspace Key  ] ----------------------------------------
" Always let Vim handle backspace properly
set backspace=indent,eol,start                              | " Set backspace to handle indent, eol, and start 
set t_kb=                                                   | " Clear any existing backspace key setting

" Universal Backspace Fix (works on ALL terminals)
" Case 1: Terminal sends DEL ( ^? )
inoremap <Char-0x7f> <BS>
nnoremap <Char-0x7f> <BS>
cnoremap <Char-0x7f> <BS>


" Case 2: Terminal sends Ctrl-H ( ^H )
inoremap <C-H> <BS>
nnoremap <C-H> <BS>
cnoremap <C-H> <BS>

" Case 3: Terminal sends actual <BS>
inoremap <BS> <BS>
nnoremap <BS> <BS>
cnoremap <BS> <BS>
" -------------------------------- [ End Backspace Key Setting ] ---------

" [ Plugin Diff Char Configuration ] ----------------------------------------
let g:DiffUnit = 'Char'              | " Set Diff Unit to Char
let g:DiffColors = 3                 | " Set number of colors for Diff Char

" [ Vimdiff Specific Settings ] ----------------------------------------
if &diff
    set wrap                                        | " Enable line wrapping in diff mode
    set linebreak                                   | " Enable line break at word boundaries    
    " colorscheme darkblue                          | " Set colorscheme for vimdiff
    execute "colorscheme " . colorscheme_name       | " Set colorscheme based on Vim version
    set background=dark                             | " Set background to dark in diff mode
    syntax off                                      | " Disable syntax highlighting in diff mode  
endif

" [ Useful Key Mapping ] ----------------------------------------
nnoremap <C-q> <C-V>                                    | " Adding Ctrl + q for the visual block selection
nnoremap <leader>do V:diffget<CR>                       | " Key Mapping for Diff Get
nnoremap <leader>dp V:diffput<CR>                       | " Key Mapping for Diff Put
nnoremap <leader>df :set diffopt=filler,context:1<CR>   | " Set 'diffopt' option for diff mode
nnoremap <leader>wd :windo diffthis<CR>                 | " Set command for :windo diffthis
nnoremap <leader>ww :windo set wrap<CR>                 | " Set command for :windo set wrap
nnoremap <leader>du :diffupdate<CR>                     | " Set command for :diffupdate
nnoremap <leader>ln :windo set number!<CR>              | " Set command for toggling line numbers
nnoremap <leader>hc :windo set list!<CR>                | " Set command for toggling list
nnoremap <leader>lr :windo set relativenumber!<CR>      | " Set command for toggling relative line numbers
nnoremap <leader>sp :windo set spell!<CR>               | " Set command for spell check
nnoremap <leader>sy :windo syntax enable!<CR>           | " Set command for toggling syntax
nnoremap Q :qa<CR>                                      | " Map Q to quit all
noremap <leader>ctc :windo set listchars=tab:▸▸⋮,eol:$,space:.,trail:~,extends:>,precedes:<<CR>:windo set list!<CR>         | " Advanced toggle listchars


" [ Color Scheme Cycling Function ] ----------------------------------------
function! CycleColorScheme()
    let color_scheme_files = globpath(&runtimepath, 'colors/*.vim')                                         | " Get a list of all color scheme files
    let color_schemes = map(split(color_scheme_files, '\n'), 'fnamemodify(v:val, ":t:r")')                  | " Extract the color scheme names from the file names
    let color_scheme_index = index(color_schemes, g:colors_name)                                            | " Get the current color scheme index
    let color_scheme_index = (color_scheme_index + 1) % len(color_schemes)                                  | " Increment the index (wrapping around to the start of the list if necessary)
    execute 'colorscheme ' . color_schemes[color_scheme_index]                                              | " Set the color scheme to the new index
    
    " Display the current color scheme in the command line
    if exists('g:colors_name')
        echo 'Current color scheme: ' . g:colors_name
        sleep 1   " Wait 1 second before clearing the message
    else
        echo 'No color scheme set'
    endif
endfunction

nnoremap <leader>cs :call CycleColorScheme()<CR>        | " Mapping to call the function


" [ Custom Mappings Help Function ] ----------------------------------------
let g:custom_map_help = {
    \ '\tl': 'Toggle listchars',
    \ '\do': 'Diff Get Single Line',
    \ '\dp': 'Diff Put Single Line',
    \ '\df': 'Set diffopt for diff mode',
    \ '\wd': 'Windo diffthis command',
    \ '\ww': 'Windo set wrap command',
    \ '\du': 'Diffupdate command',
    \ '\ln': 'Toggle line numbers',
    \ '\hc': 'Toggle list',
    \ '\lr': 'Toggle relative line numbers',
    \ '\sp': 'Toggle spell check',
    \ '\sy': 'Toggle syntax',
    \ '\h': 'Show custom mappings help',
    \ '\cs': 'Cycle through color schemes',
    \ }

function! ShowCustomMapHelp()
    echo "Custom mappings:"
    for [key, desc] in items(g:custom_map_help)
        echo key . ": " . desc
    endfor

    " Display the current color scheme
    if exists('g:colors_name')
        echo 'Current color scheme: ' . g:colors_name
    else
        echo 'No color scheme set'
    endif
endfunction

" Set command for custom mappings help
nnoremap <leader>h :call ShowCustomMapHelp()<CR>

" --------------------------------[ End Custom Mappings Help Function ]---------



" [ Go to Parent Bracket Functions ] ----------------------------------------
" Function to up to to the parent bracket
function! GoUpToParentBracket() 
    let openBrackets = ['[', '(', '{']
    let closeBrackets = [']', ')', '}']
    let stack = []
    let lineNum = line('.')
    let colNum = col('.')

    " Iterate backwards through lines and columns
    while lineNum > 0
        let lineContent = getline(lineNum)
        while colNum > 0
            let char = lineContent[colNum - 1]

            " Check if the character is a closing bracket
            if index(closeBrackets, char) != -1
                call add(stack, char)
            " Check if the character is an opening bracket
            elseif index(openBrackets, char) != -1
                if len(stack) > 0
                    let top = stack[-1]
                    " Check if the opening and closing brackets match
                    if (char == '[' && top == ']') || (char == '(' && top == ')') || (char == '{' && top == '}')
                        call remove(stack, -1)
                    else
                        " Found the parent bracket
                        call cursor(lineNum, colNum)
                        return
                    endif
                else
                    " Found the parent bracket
                    call cursor(lineNum, colNum)
                    return
                endif
            endif

            let colNum -= 1
        endwhile

        let lineNum -= 1
        let colNum = len(getline(lineNum))
    endwhile
endfunction

" -------------------------------- [ End Go Up to Parent Bracket Functions ] ---------



" [ Go Down to Parent Bracket Function ] ----------------------------------------
" Function to go down to the parent bracket
function! GoDownToParentBracket()
    let openBrackets = ['[', '(', '{']
    let closeBrackets = [']', ')', '}']
    let stack = []
    let lineNum = line('.')
    let colNum = col('.')

    " Iterate forwards through lines and columns
    while lineNum <= line('$')
        let lineContent = getline(lineNum)
        while colNum <= len(lineContent)
            let char = lineContent[colNum - 1]

            " Check if the character is an opening bracket
            if index(openBrackets, char) != -1
                call add(stack, char)
            " Check if the character is a closing bracket
            elseif index(closeBrackets, char) != -1
                if len(stack) > 0
                    let top = stack[-1]
                    " Check if the opening and closing brackets match
                    if (char == ']' && top == '[') || (char == ')' && top == '(') || (char == '}' && top == '{')
                        call remove(stack, -1)
                    else
                        " Found the parent bracket
                        call cursor(lineNum, colNum)
                        return
                    endif
                else
                    " Found the parent bracket
                    call cursor(lineNum, colNum)
                    return
                endif
            endif

            let colNum += 1
        endwhile

        let lineNum += 1
        let colNum = 1
    endwhile
endfunction

" -------------------------------- [ End Go Down to Parent Bracket Functions ] ---------


" [ Key Mappings for Parent Bracket Functions ] ----------------------------------------
nnoremap <leader>[ :call GoUpToParentBracket()<CR>
nnoremap <leader>] :call GoDownToParentBracket()<CR>

" [ Regex Search on Word ] ----------------------------------------
nnoremap <leader>* :let @/='.*'.expand('<cword>').'.*'<CR>              | " Map leader * to search for the word under cursor


" [ Save and Replace Visual Selection Functions ] ----------------------------------------
" Function to save the visual selection to register 'a'
function! SaveSelection()
    normal! "ay
    echo "Selection saved to register 'a'"
endfunction

" Function to replace the visual selection with the content of register 'a'
function! ReplaceWithRegister()
    " Get the visually selected text and save it in register 'b'
    normal! "by

    " Get the search and replacement text from registers
    let l:search_text = getreg('b')
    let l:replace_text = getreg('a')

    " Perform the replacement in the selected visual area
    execute "normal! gv:s?" . l:search_text . "?" . l:replace_text . "?g"
    echo "Replaced with content from register 'a'"
endfunction

" [ Key Mappings for Save and Replace Visual Selection Functions ] -------------------------
vnoremap <leader>s :<C-u>call SaveSelection()<CR>
vnoremap <leader>r :<C-u>call ReplaceWithRegister()<CR>


" [ Additional Useful Key Mappings ] ----------------------------------------
nnoremap <leader>e :Lexplore 20<CR>                 | " Open file explorer with 20 columns

" Tabs "
nnoremap <leader>tn :tabnew<CR>                     | " New tab
nnoremap <leader>tc :tabclose<CR>                   | " New close 
nnoremap <leader>tl :tabnext<CR>                    | " New next 
nnoremap <leader>th :tabprevious<CR>                | " New previous 
nnoremap <leader>tc :tabclose<CR>                   | " New close 
nnoremap <leader>to :tabonly<CR>                    | " New Only

" Buffers "
nnoremap <leader>bl :ls<CR>:redraw<CR>              | " List buffers
nnoremap <leader>bn :bnext<CR>                      | " Next buffer 
nnoremap <leader>bp :bprevious<CR>                  | " Previous buffer
nnoremap <leader>bc :bd<CR>                         | " Close buffer

" Windows "
nnoremap <leader>ws :split<CR>                      | " Horizontal split
nnoremap <leader>wv :vsplit<CR>                     | " Vertical split
nnoremap <leader>wc :close<CR>                      | " Close window
nnoremap <leader>wh <C-w>h                          | " Move left
nnoremap <leader>wj <C-w>j                          | " Move down
nnoremap <leader>wk <C-w>k                          | " Move up
nnoremap <leader>wl <C-w>l                          | " Move right
nnoremap <leader>w= <C-w>=                          | " Equalize window size


" [ Cursor and Additional Settings ] ----------------------------------------
set laststatus=2                                                    | " Always show the status line
set cursorline                                                      | " Highlight the current line
set cursorcolumn                                                    | " Highlight the current column
highlight CursorLine cterm=NONE ctermbg=darkgrey guibg=darkgrey     | " Highlight current line with dark grey
highlight CursorColumn cterm=NONE ctermbg=darkgrey guibg=darkgrey   | " Highlight current column with dark grey
set guicursor=n-v-c:block-Cursor                                    | " Set cursor style for normal, visual, and command modes
highlight Cursor guifg=black guibg=yellow                           | " Highlight cursor in yellow in GUI mode 

" Set cursor style for insert mode to blinking bar
if &term =~ 'xterm'                                                 | " Check if terminal supports xterm sequences
  let &t_SI = "\<Esc>[5 q"                                          | " Set cursor to blinking bar in insert mode
  let &t_EI = "\<Esc>[1 q"                                          | " Set cursor to blinking block in normal mode
endif

" [ Diffchar Plugin Macros and Key Mappings ] ----------------------------------------
nnoremap <leader>p :call diffchar#CopyDiffCharPair(1)<CR>               | " Key Mapping - Put Diffchar Pair using leader p
execute "let @c = ']b'"                                                 | " Store the macro for ]b in register 'c', which goes to next diff char (single unit diff)                  
execute "let @b = '[eh'"                                                | " Store the macro for [e in register 'b', which goes to previous diff char (single unit diff)
execute "let @d = ']c'"                                                 | " Store the macro for ]c in register 'd', which goes to next diff char (diff unit macro)
execute "let @e = '[ck'"                                                | " Store the macro for [c in register 'e', which goes to previous diff char (diff unit macro)
nnoremap <F5> :call diffchar#CopyDiffCharPair(1)<CR>:diffupdate<CR>     | " Key Mapping - Put Diffchar Only using F5
nnoremap <F6> :diffput<CR>:diffupdate<CR>                               | " Key Mapping - Put Diff Line Only using F6
nnoremap <F4> @c                                                        | " Key Mapping - Go Next Diff Char (single unit diff) using F4    
nnoremap <F3> @b                                                        | " Key Mapping - Go Previous Diff Char (single unit diff) using F3
nnoremap <F7> @d                                                        | " Key Mapping - Go Next Diff Char (diff unit macro) using F7
nnoremap <F8> @e                                                        | " Key Mapping - Go Previous Diff Char (diff unit macro) using F8

" [ Macro settings ] ----------------------------------------
" Macro to open Details.txt file from LOG line in the current file, using leader l key
" execute "let @l = '/LOG:\<C-M>Wgf:Ex\<C-M>\<C-M>/Details.txt\<C-M>\<C-M>'"
" like above we can define more macros as needed
" -------------------------------- [ End Macro settings ] ---------

" [ Highlight Settings ] ----------------------------------------
" Enable 24-bit RGB colors in the terminal
highlight DiffAdd ctermfg=NONE ctermbg=green guifg=NONE guibg=green                     | " highlight DiffAdd in green
highlight DiffDelete ctermfg=NONE ctermbg=red guifg=NONE guibg=red                      | " highlight DiffDelete in red
highlight StatusLine cterm=bold ctermbg=blue ctermfg=white guibg=blue guifg=white       | " Highlight active window status line

" [ Which Key Plugin Configuration ] ----------------------------------------
set timeoutlen=500                                                      | " Set timeout length for which-key popup
let g:which_key_map = {}                                                | " Initialize which_key_map dictionary
let g:which_key_sep = ': '                                              | " Set separator for which-key entries 
let g:which_key_use_floating_win = 1                                    | " Use floating window for which-key popup
" Map leader space to trigger which-key popup
nnoremap <silent> <leader> :<c-u>WhichKey '<Space>'<CR>

let g:which_key_map['e'] = ['Lexplorer 20', 'Explorer']                                 | " Map 'e' to 'Lexplorer 20'
let g:which_key_map['['] = ['GoUpToParentBracket', 'GoUpParentBrak']                    | " Map '[' to 'GoUpToParentBracket'
let g:which_key_map[']'] = ['GoDownToParentBracket', 'GoDownParentBrak']                | " Map ']' to 'GoDownToParentBracket'
let g:which_key_map['*'] = ['Fuzzy Word Search', 'FlexiWordSearch']                     | " Map '*' to 'FlexiWordSearch' 
let g:which_key_map['p'] = ['Put Diffchar Pair', 'PutDiffCharOnly']                     | " Map 'p' to 'PutDiffCharPair'   
let g:which_key_map['g'] = ['Get Diffchar Pair', 'GetDiffCharOnly']                     | " Map 'g' to 'GetDiffCharPair'
let g:which_key_map['h'] = ['Custom helper function', 'CustomHelperFunc']               | " Map 'h' to 'CustomHelperFunction'
let g:which_key_map['hc'] = ['Toggle List', 'ToggleList']                               | " Map 'hc' to 'ToggleList'
let g:which_key_map['P'] = ['TomePlayParagraph', 'TomePlayParagraph']                   | " Map 'P' to 'TomePlayParagraph' 
let g:which_key_map['ctc'] = ['Toggle List Advanced', 'ToggleListAdvanced']             | " Map 'ctc' to 'ToggleListAdvanced'
let g:which_key_map['do'] = ['Diff Visual Get Sinle Line', 'vDiffGetSinleLine']         | " Map 'do' to 'vDiffGetSinleLine'
let g:which_key_map['dp'] = ['Diff Visual Put Sinle Line', 'vDiffPutSinleLine']         | " Map 'dp' to 'vDiffPutSinleLine' 
let g:which_key_map['df'] = ['Diff context 1, minimal diff', 'MinimalDiff']             | " Map 'df' to 'MinimalDiff'
let g:which_key_map['wd'] = ['Window diff this', 'DiffBothWindo']                       | " Map 'wd' to 'DiffBothWindo'
let g:which_key_map['ww'] = ['Windo Set Wrap', 'WindoSetWrap']                          | " Map 'ww' to 'WindoSetWrap'
let g:which_key_map['du'] = ['Diff Update', 'Diffupdate']                               | " Map 'du' to 'Diffupdate'
let g:which_key_map['ln'] = ['Toggle Line Number', 'ToggleLineNu']                      | " Map 'ln' to 'ToggleLineNu'  
let g:which_key_map['lr'] = ['Toggle Relative Line Number', 'ToggleRelativeLn']         | " Map 'lr' to 'ToggleRelativeLn'
let g:which_key_map['sp'] = ['Toggle Spell Check', 'ToggleSpellCheck']                  | " Map 'sp' to 'ToggleSpellCheck' 
let g:which_key_map['sy'] = ['Toggle Syntax', 'ToggleSyntax']                           | " Map 'sy' to 'ToggleSyntax'
let g:which_key_map['cs'] = ['Cycle Color Schemes', 'CycleColorSchemes']                | " Map 'cs' to 'CycleColorSchemes'
let g:which_key_map['F5'] = ['Put Diffchar Only', 'PutDiffCharOnly']                    | " Map 'F5' to 'PutDiffCharOnly'
let g:which_key_map['F6'] = ['Put Diff Line Only', 'PutDiffLine']                       | " Map 'F6' to 'PutDiffLine'
let g:which_key_map['F3'] = ['Go Next Diff Char', 'GoNexDiffChar']                      | " Map 'F3' to 'GoNexDiffChar'
let g:which_key_map['F4'] = ['Go Previous Diff Char', 'GoPrevDiffChar']                 | " Map 'F4' to 'GoPrevDiffChar'
" -------------------------------- [ End Which Key Plugin Configuration ] ---------

" [ Additional Settings for Reopening Files and Status Line ] ----------------------------------------
" Automatically jump to the last known cursor position when reopening a file
autocmd BufReadPost *
  \ if line("'\"") > 0 && line("'\"") <= line("$") |
  \   exe "normal! g`\"" |
  \ endif

set viminfo='100,<50,s10,h                          | " Set viminfo options to save more history and marks
set statusline+=%F                                  | " add the full path to the status line, so it is always visible


" [ Synmake $root Path Handling ] ----------------------------------------
" Extract root path from the first 'cd /...' line in the file
" E.g, if the file contains a line like 'Command: cd /home/user/project;',
" then g:rootpath will be set to '/home/user/project'
" autocmd BufReadPost * let g:rootpath = matchstr(getline(search('Command: cd /')), 'cd \zs/[^;]*')

" Define a command to open files using $root
" E.g., :GoRoot $root/src/main.c will open /home/user/project/src/main.c
" command! -nargs=1 GoRoot execute 'edit ' . substitute(<q-args>, '\$root', g:rootpath, '')

" Map <leader>gf to open file under cursor, replacing $root with actual path
" nnoremap <leader>gf :execute 'edit ' . substitute(expand('<cfile>'), '\$root', g:rootpath, '')<CR>
" -------------------------------- [ End Synmake $root Path Handling ] ---------