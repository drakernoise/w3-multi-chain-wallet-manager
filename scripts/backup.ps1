$projectRoot = Resolve-Path "$PSScriptRoot/.."
# Fix for Join-Path only accepting two args in some PS versions
$parentDir = Split-Path -Path $projectRoot -Parent
$backupRoot = Join-Path $parentDir "backups"

if (-not (Test-Path $backupRoot)) {
    New-Item -ItemType Directory -Force -Path $backupRoot | Out-Null
}

$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$destDir = Join-Path $backupRoot "wallet_backup_$timestamp"

Write-Host "Backing up wallet to $destDir..."
Write-Host "Source: $projectRoot"

# Exclude list (directories)
# Important: Robocopy expects strict paths or simple names for exclusions.
$excludeDirs = @("node_modules", ".git", "dist", ".vs", ".os", "tmp", "release")

# Robocopy syntax: robocopy source dest /MIR /XD dirs...
# We use & to invoke checking exit code.
# Robocopy exit codes: 0-7 are success/warnings. 8+ is error.

$args = @($projectRoot, $destDir, "/MIR", "/XD") + $excludeDirs

& robocopy $args

if ($LASTEXITCODE -ge 8) {
    Write-Error "Backup failed with Robocopy exit code $LASTEXITCODE"
    exit 1
}

Write-Host "Backup completed successfully at $destDir"
