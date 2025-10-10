#!/bin/bash

# Therapair Widget - Deployment Configuration
# Copy this file and update with your actual server details

# ============================================
# SERVER CONFIGURATION
# ============================================

# SSH Connection Details
export DEPLOY_USER="your_ssh_username"           # Replace with actual SSH username
export DEPLOY_HOST="your_server_hostname"        # Replace with actual server hostname/IP
export DEPLOY_PATH="/public_html/therapair-widget"

# Alternative: If using a different path structure
# export DEPLOY_PATH="/home/username/public_html/therapair-widget"
# export DEPLOY_PATH="/var/www/html/therapair-widget"

# ============================================
# WIDGET CONFIGURATION
# ============================================

# Widget URL for testing
export WIDGET_URL="https://unisonmentalhealth.com/find-a-therapist-who-is-right-for-you/"

# Email configuration (for future use)
export ADMIN_EMAIL="tino@unisonmentalhealth.com"
export FROM_EMAIL="bookings@unisonmentalhealth.com"

# ============================================
# DEPLOYMENT OPTIONS
# ============================================

# Files to deploy (relative to therapair-widget/)
export DEPLOY_FILES="index.html images/"

# Files to exclude from deployment
export EXCLUDE_FILES="submit-booking.php booking-thank-you.html *.md *.sh"

# Backup settings
export CREATE_BACKUP=true
export BACKUP_RETENTION_DAYS=7

# ============================================
# USAGE INSTRUCTIONS
# ============================================

echo "📋 Deployment Configuration"
echo "=========================="
echo ""
echo "1. Update the server details above"
echo "2. Run: source deploy-config.sh"
echo "3. Run: ./deploy-to-unison.sh"
echo ""
echo "Current settings:"
echo "  User: $DEPLOY_USER"
echo "  Host: $DEPLOY_HOST"
echo "  Path: $DEPLOY_PATH"
echo "  Widget: $WIDGET_URL"
