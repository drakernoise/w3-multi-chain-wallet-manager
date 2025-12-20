#!/bin/bash

# Gravity Wallet - Automated Backup Script
# Creates a production-ready backup with tag and optional release

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Gravity Wallet Backup Script${NC}"
echo "=================================="

# Get version from package.json
VERSION=$(node -p "require('./package.json').version")
DATE=$(date +%Y%m%d-%H%M%S)
TAG="v${VERSION}-backup-${DATE}"

# Optional: Custom tag name
if [ ! -z "$1" ]; then
    TAG="$1"
fi

echo -e "${YELLOW}📦 Version: ${VERSION}${NC}"
echo -e "${YELLOW}🏷️  Tag: ${TAG}${NC}"
echo ""

# Step 1: Check for uncommitted changes
echo -e "${BLUE}Step 1: Checking for changes...${NC}"
if [[ -n $(git status -s) ]]; then
    echo "✅ Changes detected"
    
    # Show what will be committed
    git status -s
    echo ""
    
    # Add all changes
    git add .
    
    # Commit with descriptive message
    COMMIT_MSG="backup: Production snapshot ${TAG}"
    git commit -m "$COMMIT_MSG"
    echo -e "${GREEN}✅ Changes committed${NC}"
else
    echo "ℹ️  No changes to commit"
fi

# Step 2: Create tag
echo ""
echo -e "${BLUE}Step 2: Creating tag...${NC}"
git tag -a "$TAG" -m "Automated production backup - $(date)"
echo -e "${GREEN}✅ Tag created: ${TAG}${NC}"

# Step 3: Push to GitHub
echo ""
echo -e "${BLUE}Step 3: Pushing to GitHub...${NC}"
git push origin main
git push origin "$TAG"
echo -e "${GREEN}✅ Pushed to GitHub${NC}"

# Step 4: Create backup branch
echo ""
echo -e "${BLUE}Step 4: Creating backup branch...${NC}"
BACKUP_BRANCH="backup/production-$(date +%Y-%m-%d)"
git branch "$BACKUP_BRANCH"
git push origin "$BACKUP_BRANCH"
echo -e "${GREEN}✅ Backup branch created: ${BACKUP_BRANCH}${NC}"

# Summary
echo ""
echo -e "${GREEN}=================================="
echo "✅ Backup Complete!"
echo "==================================${NC}"
echo ""
echo "📌 Tag: $TAG"
echo "🌿 Branch: $BACKUP_BRANCH"
echo ""
echo "🔗 Next steps:"
echo "   1. Go to: https://github.com/YOUR_USERNAME/YOUR_REPO/releases"
echo "   2. Click 'Create a new release'"
echo "   3. Select tag: $TAG"
echo "   4. Add release notes"
echo "   5. Attach dist.zip if needed"
echo ""
