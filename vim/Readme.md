# 📝 **Install Vim 9.1.741 (Patch v9.1.0741)**

This guide explains how to build Vim **version 9.1.741** (tagged as `v9.1.0741`) from source, with both **full** and **minimal** build options.
Recommended for custom scripting environments where exact patch version control matters.

---

## 📌 **1. Prerequisites**

Install required dependencies:

```bash
sudo apt update && sudo apt install -y \
    git build-essential ncurses-dev libncurses5-dev libncursesw5-dev \
    python3-dev ruby-dev lua5.4 liblua5.4-dev libperl-dev
```

---

## 📌 **2. Download Vim Source (Exact Version 9.1.741)**

Vim patch 9.1.741 corresponds to the Git tag:

```
v9.1.0741
```

Clone and checkout this exact patch:

```bash
git clone https://github.com/vim/vim.git
cd vim
git checkout v9.1.0741
```

---

# 🚀 **3. Full Build (Recommended)**

This enables all interpreters and maximum Vim features.
Best for plugin support, scripting, debugging, and long-term productivity.

```bash
make distclean || true

./configure \
  --with-features=huge \
  --enable-multibyte \
  --enable-python3interp=yes \
  --enable-rubyinterp=yes \
  --enable-luainterp=yes \
  --enable-perlinterp=yes \
  --enable-cscope \
  --enable-gui=auto \
  --enable-gtk3-check \
  --with-x \
  --prefix=/usr/local

make -j"$(nproc)"
sudo make install
```

### ✔️ **What you get**

* `+huge` feature set
* `+python3`, `+lua`, `+ruby`, `+perl`
* GUI support
* System clipboard (`+clipboard`)
* Everything needed for modern plugins

---

# 🪶 **4. Minimal Build (Lightweight Version)**

Use this only if you need Vim for very small environments or custom limited scripting.

```bash
make distclean || true

./configure \
  --with-features=small \
  --disable-nls \
  --disable-gui \
  --without-x \
  --prefix=/usr/local

make -j"$(nproc)"
sudo make install
```

### ❌ **Missing in minimal build**

* No Python3 / Lua / Ruby / Perl
* No clipboard support
* Limited features
* Many plugins will **not** work
* No GUI

Minimal is only suitable for **tiny scripting use-cases**, not daily editing.

---

# 🔎 **5. Verify Installation**

```bash
vim --version | head -n 5
```

You should see:

```
VIM - Vi IMproved 9.1.0741
```

---

# 📌 **Recommendation**

If you need Vim for:

* Custom script execution
* Plugin use
* Debugging
* Long sessions
* Custom mappings, automation, IDE-like behavior

👉 **Use the Full Build.**
It is faster, feature-rich, and avoids plugin failures.

Minimal build should be used **only** for special-purpose lightweight deployments.
