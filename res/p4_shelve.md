# Perforce Shelving Guide

## Table of Contents
- [What is Shelving?](#what-is-shelving)
- [Basic Shelving Operations](#basic-shelving-operations)
- [Viewing Shelved Changes](#viewing-shelved-changes)
- [Unshelving Changes](#unshelving-changes)
- [Updating Shelved Files](#updating-shelved-files)
- [Deleting Shelved Files](#deleting-shelved-files)
- [Managing Individual Files](#managing-individual-files)
- [Submitting Shelved Changes](#submitting-shelved-changes)
- [Troubleshooting](#troubleshooting)
- [Comparing Changes](#comparing-changes)

---

## What is Shelving?

Shelving allows you to save pending changes to the Perforce server without submitting them. This is useful for:
- Sharing work-in-progress with teammates
- Creating code reviews before submission
- Backing up your work
- Switching between tasks without losing changes

---

## Basic Shelving Operations

### Create a Shelve
| Command | Description |
|---------|-------------|
| `p4 shelve` | Create new shelve from default changelist |
| `p4 shelve -c <CL>` | Sending changelist to shelve |

**Example:**
```bash
# Create changelist and shelve files
p4 change
p4 shelve -c 12345
```

---

## Viewing Shelved Changes

### List Shelved Changelists
| Command | Description |
|---------|-------------|
| `p4 changes -s shelved` | View all shelved changelists (all users) |
| `p4 changes -s shelved -u <username>` | View shelved changelists by specific user |
| `p4 describe -S <CL>` | View details of shelved changelist |

**Examples:**
```bash
# View your own shelved changes
p4 changes -s shelved -u $(p4 info | grep "User name" | awk '{print $3}')

# View all shelved changes in the system
p4 changes -s shelved

# View details of specific shelved changelist
p4 describe -S 12345
```

---

## Unshelving Changes

### Restore Shelved Files to Workspace
| Command | Description |
|---------|-------------|
| `p4 unshelve -s <CL>` | Unshelve files from changelist to workspace |
| `p4 unshelve -s <CL> -c <target_CL>` | Unshelve into specific changelist |

**Example:**
```bash
# Unshelve changes to default changelist
p4 unshelve -s 12345

# Unshelve to specific changelist
p4 unshelve -s 12345 -c 67890
```

---

## Updating Shelved Files

### Reshelve/Update Existing Shelve

When you need to update a shelved changelist with new changes:

#### Method 1: Replace Shelved Files
```bash
# Make changes to files
vim config.py

# Re-open files to the changelist
p4 reopen -c <CL> <filename>

# Update the shelved files (replace)
p4 shelve -r -c <CL>
```

#### Method 2: Force Update
```bash
# Shelve with force flag (overwrites existing)
p4 shelve -f -c <CL>
```

**Complete Workflow:**
```bash
# 1. Make changes to your files
p4 edit config.py
vim config.py

# 2. Re-open file to specific changelist
p4 reopen -c 12345 config.py

# 3. Update the shelved files
p4 shelve -r -c 12345
```

---

## Deleting Shelved Files

### Delete Entire Shelved Changelist

**Step-by-step process:**

1. **Unshelve the files** (if you want to keep changes locally):
   ```bash
   p4 unshelve -s <CL>
   ```

2. **Delete the shelved files**:
   ```bash
   p4 shelve -d -c <CL>
   ```

3. **Revert the opened files** (if you don't need them):
   ```bash
   p4 revert <filename>
   ```

4. **Delete the changelist**:
   ```bash
   p4 change -d <CL>
   ```

**Quick delete (without keeping changes):**
```bash
p4 shelve -d -c 12345
p4 change -d 12345
```

---

## Managing Individual Files

### Remove Specific File from Shelve
| Command | Description |
|---------|-------------|
| `p4 shelve -d -c <CL> <depot_path>` | Remove specific file from shelved changelist |

**Example:**
```bash
# Remove specific file from shelve
p4 shelve -d -c 12345 //depot/main/src/config.py

# Remove multiple files
p4 shelve -d -c 12345 //depot/main/src/config.py //depot/main/src/utils.py
```

---

## Submitting Shelved Changes

### Submit After Review

#### Method 1: Delete Shelve Then Submit (Two-step)
```bash
# Delete shelved files
p4 shelve -c <CL> -d

# Submit the changelist
p4 submit -c <CL>
```

#### Method 2: Submit Shelved Changelist (Best Practice)
```bash
# Submit with -e flag (submits shelved changelist)
p4 submit -e <CL>
```

**Recommended Workflow:**
```bash
# 1. Unshelve changes (if not already in workspace)
p4 unshelve -s 12345

# 2. Reopen files to changelist (if needed)
p4 reopen -c 12345 <filename>

# 3. Submit using -e flag
p4 submit -e 12345
```

---

## Troubleshooting

### Issue: "Change has shelved files -- cannot submit"

**Problem:** Trying to submit a changelist that still has shelved files.

**Solution 1: Revert then submit**
```bash
# Revert the file in changelist
p4 revert -c 12345 <filename>

# Submit the shelved changelist
p4 submit -e 12345
```

**Solution 2: Delete shelve first**
```bash
# Delete shelved files
p4 shelve -d -c 12345

# Submit normally
p4 submit -c 12345
```

### Common Issues

| Issue | Solution |
|-------|----------|
| Can't submit with shelved files | Use `p4 submit -e <CL>` or delete shelve first |
| Shelve conflicts with workspace | Resolve conflicts, then use `p4 shelve -f -c <CL>` |
| Lost shelved changes | Use `p4 changes -s shelved -u <user>` to find them |
| Need to update shelve | Use `p4 shelve -r -c <CL>` to replace |

---

## Comparing Changes

### Diff Between Versions
| Command | Description |
|---------|-------------|
| `p4 diff2 <file>#<rev> <file>@<CL>` | Compare file revision to changelist version |
| `p4 describe -S <CL>` | View shelved changelist details and diffs |

**Examples:**
```bash
# Compare revision 3 to changelist version
p4 diff2 //depot/main/src/config.py#3 //depot/main/src/config.py@12345

# View diffs in shelved changelist
p4 describe -S 12345
```

---

## Quick Reference

### Common Workflows

**Create and Shelve:**
```bash
p4 edit <file>
vim <file>
p4 change          # Create changelist
p4 shelve -c <CL>  # Shelve changes
```

**Share Changes with Team:**
```bash
p4 shelve -c <CL>                    # Your changes
# Team member runs:
p4 unshelve -s <CL>                  # Get your changes
```

**Update Existing Shelve:**
```bash
vim <file>
p4 reopen -c <CL> <file>
p4 shelve -r -c <CL>
```

**Submit Shelved Changes:**
```bash
p4 submit -e <CL>                    # Best method
```

**Delete Shelve Completely:**
```bash
p4 shelve -d -c <CL>
p4 change -d <CL>
```

---

## Best Practices

1. **Always use descriptive changelist descriptions**: Makes it easier to find shelved changes later
2. **Use `p4 submit -e`**: Cleanest way to submit shelved changelists
3. **Shelve before code reviews**: Share work without affecting the main codebase
4. **Update shelves with `-r` flag**: Keeps changelist number consistent
5. **Clean up old shelves**: Delete shelves you no longer need
6. **Use `-S` with describe**: Shows only shelved file info, not submitted changes

---

## Command Summary

| Command | Purpose |
|---------|---------|
| `p4 shelve -c <CL>` | Create/update shelve |
| `p4 shelve -f -c <CL>` | Force shelve (overwrite) |
| `p4 shelve -r -c <CL>` | Replace shelved files |
| `p4 shelve -d -c <CL>` | Delete shelve |
| `p4 unshelve -s <CL>` | Restore shelved files |
| `p4 changes -s shelved` | List all shelves |
| `p4 describe -S <CL>` | View shelve details |
| `p4 submit -e <CL>` | Submit shelved changelist |
| `p4 reopen -c <CL> <file>` | Move file to changelist |
