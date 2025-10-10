#!/bin/bash

# Therapair Widget - Deployment Script for Unison Server
# Deploys index.html and images/ folder to public_html/therapair-widget/

set -e  # Exit on any error

# Configuration
DEPLOY_USER="your_username"           # Replace with actual SSH username
DEPLOY_HOST="your_server_hostname"    # Replace with actual server hostname/IP
DEPLOY_PATH="/public_html/therapair-widget"
LOCAL_WIDGET_DIR="./therapair-widget"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Therapair Widget Deployment to Unison Server${NC}"
echo "=================================================="

# Check if SSH key exists
if [ ! -f ~/.ssh/id_rsa ] && [ ! -f ~/.ssh/id_ed25519 ]; then
    echo -e "${RED}❌ No SSH key found. Please set up SSH key authentication first.${NC}"
    echo "Run: ssh-keygen -t ed25519 -C 'your_email@example.com'"
    exit 1
fi

# Check if required files exist
if [ ! -f "$LOCAL_WIDGET_DIR/index.html" ]; then
    echo -e "${RED}❌ index.html not found in $LOCAL_WIDGET_DIR${NC}"
    exit 1
fi

if [ ! -d "$LOCAL_WIDGET_DIR/images" ]; then
    echo -e "${RED}❌ images/ folder not found in $LOCAL_WIDGET_DIR${NC}"
    exit 1
fi

echo -e "${YELLOW}📋 Pre-deployment checks:${NC}"
echo "✅ index.html found"
echo "✅ images/ folder found"
echo "✅ SSH key configured"

# Test SSH connection
echo -e "${YELLOW}🔐 Testing SSH connection...${NC}"
if ! ssh -o ConnectTimeout=10 -o BatchMode=yes "$DEPLOY_USER@$DEPLOY_HOST" "echo 'SSH connection successful'" 2>/dev/null; then
    echo -e "${RED}❌ SSH connection failed. Please check:${NC}"
    echo "   - Server hostname/IP: $DEPLOY_HOST"
    echo "   - Username: $DEPLOY_USER"
    echo "   - SSH key is added to server"
    echo "   - Server allows SSH connections"
    exit 1
fi

echo -e "${GREEN}✅ SSH connection successful${NC}"

# Create backup of current files on server
echo -e "${YELLOW}💾 Creating backup of current files...${NC}"
BACKUP_DIR="therapair-widget-backup-$(date +%Y%m%d-%H%M%S)"
ssh "$DEPLOY_USER@$DEPLOY_HOST" "mkdir -p $DEPLOY_PATH/backups/$BACKUP_DIR && cp -r $DEPLOY_PATH/* $DEPLOY_PATH/backups/$BACKUP_DIR/ 2>/dev/null || true"
echo -e "${GREEN}✅ Backup created: $BACKUP_DIR${NC}"

# Upload index.html
echo -e "${YELLOW}📤 Uploading index.html...${NC}"
scp "$LOCAL_WIDGET_DIR/index.html" "$DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_PATH/"
echo -e "${GREEN}✅ index.html uploaded${NC}"

# Upload images folder
echo -e "${YELLOW}📤 Uploading images/ folder...${NC}"
rsync -avz --delete "$LOCAL_WIDGET_DIR/images/" "$DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_PATH/images/"
echo -e "${GREEN}✅ images/ folder uploaded${NC}"

# Set correct permissions
echo -e "${YELLOW}🔧 Setting file permissions...${NC}"
ssh "$DEPLOY_USER@$DEPLOY_HOST" "chmod 644 $DEPLOY_PATH/index.html && chmod 644 $DEPLOY_PATH/images/*.jpeg"
echo -e "${GREEN}✅ Permissions set${NC}"

# Verify deployment
echo -e "${YELLOW}🔍 Verifying deployment...${NC}"
REMOTE_FILES=$(ssh "$DEPLOY_USER@$DEPLOY_HOST" "ls -la $DEPLOY_PATH/")
REMOTE_IMAGES=$(ssh "$DEPLOY_USER@$DEPLOY_HOST" "ls -la $DEPLOY_PATH/images/")

echo -e "${BLUE}📁 Remote files:${NC}"
echo "$REMOTE_FILES"

echo -e "${BLUE}🖼️ Remote images:${NC}"
echo "$REMOTE_IMAGES"

# Test widget URL
echo -e "${YELLOW}🌐 Testing widget URL...${NC}"
WIDGET_URL="https://unisonmentalhealth.com/find-a-therapist-who-is-right-for-you/"
if curl -s -o /dev/null -w "%{http_code}" "$WIDGET_URL" | grep -q "200"; then
    echo -e "${GREEN}✅ Widget URL accessible${NC}"
else
    echo -e "${YELLOW}⚠️ Widget URL may not be accessible yet (caching/CDN)${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo "=================================================="
echo -e "${BLUE}📋 Summary:${NC}"
echo "✅ index.html uploaded and updated"
echo "✅ images/ folder synced"
echo "✅ File permissions set correctly"
echo "✅ Backup created: $BACKUP_DIR"
echo ""
echo -e "${BLUE}🔗 Widget URL:${NC} $WIDGET_URL"
echo -e "${BLUE}📁 Server Path:${NC} $DEPLOY_PATH"
echo ""
echo -e "${YELLOW}🧪 Next Steps:${NC}"
echo "1. Visit the widget URL to test"
echo "2. Complete the quiz to see therapist cards"
echo "3. Verify only 'Book Now' buttons show"
echo "4. Test booking form submission"
echo ""
echo -e "${BLUE}💡 To rollback if needed:${NC}"
echo "ssh $DEPLOY_USER@$DEPLOY_HOST \"cp -r $DEPLOY_PATH/backups/$BACKUP_DIR/* $DEPLOY_PATH/\""
