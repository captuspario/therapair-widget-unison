#!/bin/bash

# Therapair Widget - Simple Deployment Script
# Uploads only index.html and images/ folder to Unison server

set -e  # Exit on any error

# ============================================
# CONFIGURATION - UPDATE THESE VALUES
# ============================================

DEPLOY_USER="your_ssh_username"           # Replace with actual SSH username
DEPLOY_HOST="your_server_hostname"        # Replace with actual server hostname/IP
DEPLOY_PATH="/public_html/therapair-widget"
LOCAL_WIDGET_DIR="./therapair-widget"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🚀 Therapair Widget Deployment${NC}"
echo "=================================="

# Validate configuration
if [ "$DEPLOY_USER" = "your_ssh_username" ] || [ "$DEPLOY_HOST" = "your_server_hostname" ]; then
    echo -e "${RED}❌ Please update the configuration in this script first!${NC}"
    echo ""
    echo "Edit deploy-widget-only.sh and update:"
    echo "  DEPLOY_USER=\"your_actual_username\""
    echo "  DEPLOY_HOST=\"your_actual_server\""
    echo ""
    exit 1
fi

# Check required files
echo -e "${YELLOW}📋 Checking files...${NC}"
if [ ! -f "$LOCAL_WIDGET_DIR/index.html" ]; then
    echo -e "${RED}❌ index.html not found${NC}"
    exit 1
fi

if [ ! -d "$LOCAL_WIDGET_DIR/images" ]; then
    echo -e "${RED}❌ images/ folder not found${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Files ready for deployment${NC}"

# Test SSH connection
echo -e "${YELLOW}🔐 Testing SSH connection...${NC}"
if ! ssh -o ConnectTimeout=10 -o BatchMode=yes "$DEPLOY_USER@$DEPLOY_HOST" "echo 'Connected'" 2>/dev/null; then
    echo -e "${RED}❌ SSH connection failed${NC}"
    echo ""
    echo "Please check:"
    echo "  - Server hostname/IP: $DEPLOY_HOST"
    echo "  - Username: $DEPLOY_USER"
    echo "  - SSH key is configured"
    exit 1
fi

echo -e "${GREEN}✅ SSH connection successful${NC}"

# Create backup
echo -e "${YELLOW}💾 Creating backup...${NC}"
BACKUP_TIME=$(date +%Y%m%d-%H%M%S)
ssh "$DEPLOY_USER@$DEPLOY_HOST" "mkdir -p $DEPLOY_PATH/backups && cp $DEPLOY_PATH/index.html $DEPLOY_PATH/backups/index.html.$BACKUP_TIME 2>/dev/null || true"
echo -e "${GREEN}✅ Backup created${NC}"

# Upload index.html
echo -e "${YELLOW}📤 Uploading index.html...${NC}"
scp "$LOCAL_WIDGET_DIR/index.html" "$DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_PATH/"
echo -e "${GREEN}✅ index.html uploaded${NC}"

# Upload images folder
echo -e "${YELLOW}📤 Uploading images/ folder...${NC}"
rsync -avz --delete "$LOCAL_WIDGET_DIR/images/" "$DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_PATH/images/"
echo -e "${GREEN}✅ images/ folder uploaded${NC}"

# Set permissions
echo -e "${YELLOW}🔧 Setting permissions...${NC}"
ssh "$DEPLOY_USER@$DEPLOY_HOST" "chmod 644 $DEPLOY_PATH/index.html && chmod 644 $DEPLOY_PATH/images/*.jpeg 2>/dev/null || true"
echo -e "${GREEN}✅ Permissions set${NC}"

# Verify deployment
echo -e "${YELLOW}🔍 Verifying deployment...${NC}"
ssh "$DEPLOY_USER@$DEPLOY_HOST" "ls -la $DEPLOY_PATH/ && echo '--- Images ---' && ls -la $DEPLOY_PATH/images/"

echo ""
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo "================================"
echo ""
echo -e "${BLUE}📋 What was deployed:${NC}"
echo "  ✅ index.html (updated - removes View Profile buttons)"
echo "  ✅ images/ folder (all therapist photos)"
echo ""
echo -e "${BLUE}🔗 Test your widget:${NC}"
echo "  https://unisonmentalhealth.com/find-a-therapist-who-is-right-for-you/"
echo ""
echo -e "${YELLOW}🧪 Next steps:${NC}"
echo "  1. Visit the widget URL"
echo "  2. Complete the quiz"
echo "  3. Verify only 'Book Now' buttons show"
echo "  4. Test booking form (should use FormSubmit.co for now)"
echo ""
echo -e "${BLUE}💾 Backup location:${NC}"
echo "  $DEPLOY_PATH/backups/index.html.$BACKUP_TIME"
