# TMUX 3.5a — Professional Setup Guide

A clean, structured, and visually rich guide to help you install, configure, and optimize **tmux 3.5a**, along with plugin manager setup and troubleshooting.

---

## 🎛️ Overview

This guide provides:

* Installation steps for **tmux 3.5a** from source
* System prerequisites for Ubuntu/Debian and CentOS/Fedora
* Instructions to install **TPM (Tmux Plugin Manager)**
* Notes on configuration file setup
* Fixes for CRLF formatting issues

Copy relevant pieces into your `~/.tmux.conf` for a refined and personalized tmux workflow.

---

## 🛠️ Install tmux 3.5a (From Source)

### **1. Download Source Code**

Download the release from the official repository:

```
https://github.com/tmux/tmux/releases/tag/3.5a
```

---

### **2. Extract the Archive**

```bash
tar -xvf tmux-3.5a.tar.gz
cd tmux-3.5a
```

---

### **3. Configure the Build**

```bash
./configure
```

---

### **4. Compile Source**

```bash
make
```

---

### **5. Install tmux (Global)**

Requires sudo:

```bash
sudo make install
```

This installs tmux typically to:

```
/usr/local/bin/tmux
```

---

### **6. Verify Installation**

```bash
tmux -V
```

Expected output:

```
tmux 3.5a
```

---

## 📦 Prerequisites

Install required build dependencies.

### **Ubuntu / Debian**

```bash
sudo apt update
sudo apt install -y git build-essential automake pkg-config libevent-dev libncurses-dev bison
```

### **CentOS / RHEL / Fedora**

```bash
sudo yum install -y gcc make automake pkgconfig libevent-devel ncurses-devel bison
```

---

## 🔌 Install TPM (Tmux Plugin Manager)

TPM allows easy installation and update of tmux plugins.

```bash
git clone https://github.com/tmux-plugins/tpm ~/.tmux/plugins/tpm
```

TPM will load automatically when configured inside `.tmux.conf`.

---

## 📁 Copy Your Configuration Files

After preparing your custom configurations, copy them into appropriate directories:

```bash
cp -rf myconfigs ~/.tmux/myconfigs
```

Ensure your main config file is placed at:

```
~/.tmux.conf
```

---

## 🧹 Fix Line Ending Issues (CRLF → LF)

If tmux shows errors such as `command failed`, it's often due to **Windows CRLF** line endings.
Convert your `.tmux.conf` to Unix LF format:

```bash
dos2unix ~/.tmux.conf
```

This immediately resolves most unexpected config load errors.

---

## ✔️ You're Ready!

Your tmux environment is now properly set up with version 3.5a, plugins, and configurations. You can begin customizing key bindings, themes, and workflows confidently.

If you want, I can add:

* A professional **.tmux.conf template**
* Color-coded sections for theme, bindings, plugins
* A directory structure guide
* A troubleshooting section

Just tell me!
