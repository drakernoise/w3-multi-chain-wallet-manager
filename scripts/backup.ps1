# Gravity Wallet - Automated Backup Script (PowerShell)
$ErrorActionPreference = "Stop"

Write-Host "Gravity Wallet Backup Script" -ForegroundColor Blue
Write-Host "==================================" -ForegroundColor Blue
Write-Host ""

# Get version
$packageJson = Get-Content "package.json" | ConvertFrom-Json
$version = $packageJson.version
$date = Get-Date -Format "yyyyMMdd-HHmmss"
$tag = "v$version-backup-$date"

if ($args.Count -gt 0) {
    $tag = $args[0]
}

Write-Host "Version: $version" -ForegroundColor Yellow
Write-Host "Tag: $tag" -ForegroundColor Yellow
Write-Host ""

# Step 1: Check for changes
Write-Host "Step 1: Checking for changes..." -ForegroundColor Blue
$status = git status -s
if ($status) {
    Write-Host "Changes detected" -ForegroundColor Green
    git add .
    $commitMsg = "backup: Production snapshot $tag"
    git commit -m $commitMsg
    Write-Host "Changes committed" -ForegroundColor Green
}
else {
    Write-Host "No changes to commit" -ForegroundColor Cyan
}

# Step 2: Create tag
Write-Host ""
Write-Host "Step 2: Creating tag..." -ForegroundColor Blue
$tagMsg = "Automated production backup - $(Get-Date)"
git tag -a $tag -m $tagMsg
Write-Host "Tag created: $tag" -ForegroundColor Green

# Step 3: Push
Write-Host ""
Write-Host "Step 3: Pushing to GitHub..." -ForegroundColor Blue
git push origin main
git push origin $tag
Write-Host "Pushed to GitHub" -ForegroundColor Green

# Step 4: Backup branch
Write-Host ""
Write-Host "Step 4: Creating backup branch..." -ForegroundColor Blue
$backupBranch = "backup/production-$(Get-Date -Format 'yyyy-MM-dd')"
git branch -f $backupBranch
git push -f origin $backupBranch
Write-Host "Backup branch created: $backupBranch" -ForegroundColor Green

Write-Host ""
Write-Host "==================================" -ForegroundColor Green
Write-Host "Backup Complete!" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green
