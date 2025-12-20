# Gravity Wallet - Automated Backup Script (PowerShell)
# Creates a production-ready backup with tag and optional release

$ErrorActionPreference = "Stop"

Write-Host "🚀 Gravity Wallet Backup Script" -ForegroundColor Blue
Write-Host "==================================" -ForegroundColor Blue
Write-Host ""

# Get version from package.json
$packageJson = Get-Content "package.json" | ConvertFrom-Json
$version = $packageJson.version
$date = Get-Date -Format "yyyyMMdd-HHmmss"
$tag = "v$version-backup-$date"

# Optional: Custom tag name
if ($args.Count -gt 0) {
    $tag = $args[0]
}

Write-Host "📦 Version: $version" -ForegroundColor Yellow
Write-Host "🏷️  Tag: $tag" -ForegroundColor Yellow
Write-Host ""

# Step 1: Check for uncommitted changes
Write-Host "Step 1: Checking for changes..." -ForegroundColor Blue
$status = git status -s
if ($status) {
    Write-Host "✅ Changes detected" -ForegroundColor Green
    
    # Show what will be committed
    git status -s
    Write-Host ""
    
    # Add all changes
    git add .
    
    # Commit with descriptive message
    $commitMsg = "backup: Production snapshot $tag"
    git commit -m $commitMsg
    Write-Host "✅ Changes committed" -ForegroundColor Green
} else {
    Write-Host "ℹ️  No changes to commit" -ForegroundColor Cyan
}

# Step 2: Create tag
Write-Host ""
Write-Host "Step 2: Creating tag..." -ForegroundColor Blue
$tagMsg = "Automated production backup - $(Get-Date)"
git tag -a $tag -m $tagMsg
Write-Host "✅ Tag created: $tag" -ForegroundColor Green

# Step 3: Push to GitHub
Write-Host ""
Write-Host "Step 3: Pushing to GitHub..." -ForegroundColor Blue
git push origin main
git push origin $tag
Write-Host "✅ Pushed to GitHub" -ForegroundColor Green

# Step 4: Create backup branch
Write-Host ""
Write-Host "Step 4: Creating backup branch..." -ForegroundColor Blue
$backupBranch = "backup/production-$(Get-Date -Format 'yyyy-MM-dd')"
git branch $backupBranch
git push origin $backupBranch
Write-Host "✅ Backup branch created: $backupBranch" -ForegroundColor Green

# Summary
Write-Host ""
Write-Host "==================================" -ForegroundColor Green
Write-Host "✅ Backup Complete!" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green
Write-Host ""
Write-Host "📌 Tag: $tag"
Write-Host "🌿 Branch: $backupBranch"
Write-Host ""
Write-Host "🔗 Next steps:"
Write-Host "   1. Go to: https://github.com/YOUR_USERNAME/YOUR_REPO/releases"
Write-Host "   2. Click 'Create a new release'"
Write-Host "   3. Select tag: $tag"
Write-Host "   4. Add release notes"
Write-Host "   5. Attach dist.zip if needed"
Write-Host ""
