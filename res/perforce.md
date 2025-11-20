# Perforce (P4) Guide

## Table of Contents
- [Quick Reference](#quick-reference)
- [Common Commands](#common-commands)
- [Server Connections](#server-connections)
- [Client Setup](#client-setup)
- [File Operations Workflow](#file-operations-workflow)
- [Accessing Depot Files](#accessing-depot-files)
- [Conflict Resolution](#conflict-resolution)
- [File History & Annotations](#file-history--annotations)
- [Code Collaborator (CCollab)](#code-collaborator-ccollab)
- [Resources](#resources)

---

## Quick Reference

### Quick Login Commands
```bash
p4 -p perforce.example.com:1666 login
p4 -p p4server:1666 login
```

### Common Server Ports
- **Default Port**: `1666` (standard Perforce port)
- **SSL Port**: `1667` (for SSL connections)
- **Example**: `perforce.example.com:1666`
- **Local Server**: `localhost:1666`

---

## Common Commands

### Basic Commands
| Command | Description |
|---------|-------------|
| `p4 info` | Display client/server information |
| `p4 passwd` | Change your Perforce password |
| `p4 login -a` | Login for all Perforce servers |
| `p4 login` | Login to Perforce server |
| `p4 logout` | Logout from Perforce server |

### Workspace Sync
| Command | Description |
|---------|-------------|
| `p4 sync ...` | Sync all files in current workspace |
| `p4 sync <view name>` | Sync specific view |
| `p4 sync <filename>` | Sync specific file |
| `p4 sync -f ./...` | Force sync all files in current directory (re-download even if up-to-date) |

### File Operations
| Command | Description |
|---------|-------------|
| `p4 opened` | List files opened in pending changelists |
| `p4 opened ./...` | List files opened in pending changelists |
| `p4 edit <filename>` | Open file for editing |
| `p4 add <filename>` | Add new file to depot |
| `p4 delete <filename>` | Mark file for deletion |
| `p4 revert <filename>` | Discard changes to file |

### Diff & Review
| Command | Description |
|---------|-------------|
| `p4 diff` | Show differences for all opened files |
| `p4 diff <filename>` | Show differences for specific file |
| `p4 diff <filename>#<SL_number>` | Diff against specific revision |

### Changelists
| Command | Description |
|---------|-------------|
| `p4 change` | Create or edit a changelist |
| `p4 change -u <CL_number>` | Update existing changelist |
| `p4 change <CL_number>` | Edit own changelist before submit |
| `p4 submit -c <CL_number>` | Submit specific changelist |
| `p4 describe <CL_number>` | Show changelist details |
| `p4 changes -m4 ./...#have` | Show last 4 changelists for synced files in current directory |

### Shelving
| Command | Description |
|---------|-------------|
| `p4 shelve -c <CL_number>` | Shelve files in changelist (save to server without submitting) |
| `p4 shelve -f -c <CL_number>` | Force shelve (overwrite existing shelved files) |
| `p4 unshelve -s <CL_number>` | Restore shelved files to workspace |
| `p4 shelve -d -c <CL_number>` | Delete shelved files from changelist |

### File History
| Command | Description |
|---------|-------------|
| `p4 filelog -m 10 <filename>` | Show last 10 revisions of file |
| `p4 annotate -c <filename>` | Show file with changelist annotations |

### Client Management
| Command | Description |
|---------|-------------|
| `p4 depots` | List all depots |
| `p4 clients` | List all Perforce clients |
| `p4 clients \| grep <username>` | Search for specific client |
| `p4 client` | View/edit current client specification |
| `p4 -c <client_name> client` | View/edit specific client |
| `p4 client <client_name>` | View/edit specific client |
| `p4 client -t <existing_client> <new_client>` | Create new client using existing client as template |
| `p4 client -d <client_name>` | Delete client |

### Path Information
| Command | Description |
|---------|-------------|
| `p4 where //depot/path/...` | Show workspace location of depot path |
| `p4 have //depot/path/...` | Show synced files and revisions |

### Browsing Depot
| Command | Description |
|---------|-------------|
| `p4 dirs //depot/main/"*"` | List directories (with quotes for wildcards) |
| `p4 files "//depot/main/src/utils/*"` | List all files in directory |

**Examples:**
```bash
# List all top-level directories in main branch
p4 dirs //depot/main/"*"

# List all files in utils directory
p4 files "//depot/main/src/utils/*"

# List all files recursively
p4 files //depot/main/...
```

### Advanced Search
```bash
# Search changelist by text using p4 annotate
p4 annotate -c config.py | grep "<search text>"
```

---

## Server Connections

### Accessing Different Servers

**Remote Server:**
```bash
p4 -p perforce.example.com:1666 print //depot/main/src/app/README.md
p4 -p perforce.example.com:1666 files //depot/main/src/app/...
```

**Local Server:**
```bash
p4 -p localhost:1666 info
```

---

## Client Setup

### Step-by-Step Client Configuration

#### 1. Create Workspace Directory
```bash
cd ~/workspaces
mkdir my-project-workspace
cd my-project-workspace
```

#### 2. Create P4 Config File
```bash
vi .p4config
```

Add the following content:
```bash
P4CLIENT=my-project-workspace
P4PORT=perforce.example.com:1666
P4USER=username
```

#### 3. Configure Shell Environment
```bash
vi ~/.cshrc
```

Add these environment variables:
```tcsh
setenv P4CONFIG .p4config
setenv P4EDITOR vim
setenv P4DIFF vimdiff
```

Source the file:
```bash
source ~/.cshrc
```

#### 4. Initialize Client
```bash
cd ~/workspaces/my-project-workspace

# Verify connection
p4 info

# Set password
p4 passwd

# Login
p4 login -a
p4 login

# List available depots
p4 depots
```

#### 5. Configure Client View
```bash
p4 -c my-project-workspace client
```

In the editor, add depot paths to the `View:` section:
```
View:
    //depot/main/src/... //my-project-workspace/src/...
    //depot/main/docs/... //my-project-workspace/docs/...
```

Save and exit (`:wq` in vim).

#### 6. Sync Files
```bash
p4 sync src/...
```

---

## File Operations Workflow

### Standard Edit and Submit Workflow

#### 1. Navigate to Workspace
```bash
cd ~/workspaces/my-project-workspace/src
```

#### 2. Sync Latest Version
```bash
p4 sync config.py
```

#### 3. Open File for Edit
```bash
p4 edit config.py
```

#### 4. Make Changes
```bash
vim config.py
# Edit as per your requirements
```

#### 5. Review Changes
```bash
p4 diff config.py
```
**Important:** Before submitting any change, do proper testing and consider using code review tools.

#### 6. Create Changelist
```bash
p4 change
```
Add a clear description of changes.

#### 7. Submit Changes
```bash
p4 submit -c <CL_number>
```

#### 8. Verify Submission
```bash
p4 filelog -m5 config.py
```

---

## Accessing Depot Files

### View Files Without Syncing

**Print file contents:**
```bash
p4 -p perforce.example.com:1666 print //depot/main/src/app/README.md
```

**List directory contents:**
```bash
p4 -p perforce.example.com:1666 files //depot/main/src/app/...
```

---

## Conflict Resolution

### Resolving Conflicts While Submitting

When you encounter conflicts during submission:

```bash
# Sync latest changes
p4 sync ...

# Auto-merge using their changes
p4 resolve -am config.py

# Review the merged result
p4 diff config.py

# Submit the changelist
p4 submit -c <CL_number>

# Verify submission
p4 filelog -m5 config.py
```

### Resolve Options
- `-am` - Accept merge result (auto-merge)
- `-at` - Accept theirs (use depot version)
- `-ay` - Accept yours (keep your version)
- `-as` - Accept safe merges only
- `-af` - Accept force (skip merge)

---

## File History & Annotations

### View File History

**Show last 100 revisions with filtering:**
```bash
p4 filelog -m100 config.py | grep "release-2024"
```

**Describe specific changelist:**
```bash
p4 describe <change_number>
p4 describe 12345
```

### Annotate Files

**View file with changelist annotations:**
```bash
p4 annotate -c config.py
```

**Search for specific changes:**
```bash
p4 annotate -c config.py | grep "database connection"
```

---

## Code Review Integration

### Code Review Tools

Perforce integrates with various code review tools:
- **Swarm** - Perforce's built-in code review tool
- **Helix TeamHub** - Git/Perforce collaboration platform
- **Third-party tools** - Review Board, Gerrit, etc.

### Using Perforce Swarm

#### 1. One-Time Setup
```bash
# Configure your editor
vi ~/.cshrc
```

Add environment variables:
```tcsh
setenv P4EDITOR vim
setenv P4DIFF vimdiff
```

Source the file:
```bash
source ~/.cshrc
```

#### 2. Create Code Review

##### Prepare Changes
```bash
# Check opened files
p4 opened

# Revert if needed (optional)
p4 revert config.py

# Sync latest
p4 sync config.py

# Edit file
vi config.py
# Make changes as per requirements
```

##### Review Locally
```bash
# Check differences
p4 diff config.py

# Create changelist with description
p4 change
```
**Note:** Add a clear description and ensure correct files are included. This command generates a changelist number.

##### Create Review in Swarm
```bash
# Create new review with shelved changelist
p4 shelve -c <change_number>
```

##### Configure Review in Web UI

1. Open browser: `https://swarm.example.com`
2. Login with your credentials
3. Navigate to **Reviews** > **Create New Review**
4. Select your shelved changelist
5. Add participants:
   - **Reviewers** - People who must approve
   - **Observers** - People who should be notified
6. Add description:
   - Include test results
   - Provide context for reviewers
7. Save the review

### Code Review Workflow Diagram

```
Create Changelist (p4 change)
         ↓
Shelve Changes (p4 shelve -c <CL>)
         ↓
Create Review in Tool
         ↓
Add Reviewers & Observers
         ↓
Wait for Approval
         ↓
Submit (p4 submit -c <CL>)
```

---

## Resources

### Documentation
- **Perforce Official Documentation**  
  [Perforce Documentation](https://www.perforce.com/manuals/cmdref/)
  
- **P4 Command Reference**  
  [Command Line Reference](https://www.perforce.com/manuals/cmdref/Content/CmdRef/Home-cmdref.html)

### Common Workflows

**Quick Edit Workflow:**
```bash
p4 sync <file>
p4 edit <file>
vim <file>
p4 diff <file>
p4 change
p4 submit -c <CL>
```

**Review Workflow:**
```bash
p4 change                    # Create changelist
p4 shelve -c <CL>           # Shelve changes
# Create review in Swarm/review tool
p4 submit -c <CL>           # After approval
```

**Conflict Resolution:**
```bash
p4 sync ...
p4 resolve -am <file>
p4 diff <file>
p4 submit -c <CL>
```

---

## Tips & Best Practices

1. **Always sync before editing**: `p4 sync <file>` before `p4 edit <file>`
2. **Use meaningful changelist descriptions**: Help others understand your changes
3. **Review diffs before submitting**: `p4 diff` catches mistakes
4. **Use code review tools**: Get peer review before submitting (Swarm, etc.)
5. **Check file history**: `p4 filelog` to understand previous changes
6. **Set up P4CONFIG**: Avoid typing server/client info repeatedly
7. **Use vimdiff**: Set `P4DIFF=vimdiff` for better diff viewing
8. **Login with -a flag**: `p4 login -a` keeps you logged in across servers
9. **Shelve before review**: Use `p4 shelve` to share changes without submitting
10. **Test before submitting**: Always test your changes in your workspace first

---

## Quick Commands Cheat Sheet

```bash
# Setup
p4 login -a

# Daily workflow
p4 sync <file>
p4 edit <file>
p4 diff <file>
p4 change
p4 submit -c <CL>

# Information
p4 info
p4 opened
p4 where <file>
p4 have <file>

# History
p4 filelog -m10 <file>
p4 describe <CL>
p4 annotate -c <file>

# Client management
p4 clients
p4 client
p4 depots

# Conflict resolution
p4 sync ...
p4 resolve -am <file>
```
