# Therapair Widget - Deployment Setup Guide

**Goal**: Automatically deploy `index.html` and `images/` folder to Unison server

---

## 🚀 **Quick Setup (5 minutes)**

### **Step 1: Get Server Details**
You need these details from your Unison hosting provider:
- **SSH Username**: Your server login username
- **Server Hostname/IP**: The server address (e.g., `server.unisonmentalhealth.com` or IP like `123.456.789.0`)
- **Widget Path**: Usually `/public_html/therapair-widget/` or similar

### **Step 2: Configure Deployment Script**

Edit the deployment script with your server details:

```bash
# Open the script for editing
nano deploy-widget-only.sh

# Update these lines (around line 10-12):
DEPLOY_USER="your_actual_username"     # Replace with your SSH username
DEPLOY_HOST="your_actual_server"       # Replace with your server hostname/IP
DEPLOY_PATH="/public_html/therapair-widget"  # Usually correct, but verify
```

### **Step 3: Set Up SSH Key (if not already done)**

```bash
# Generate SSH key (if you don't have one)
ssh-keygen -t ed25519 -C "your_email@example.com"

# Copy your public key to the server
ssh-copy-id your_username@your_server_hostname

# Test SSH connection
ssh your_username@your_server_hostname "echo 'SSH working!'"
```

### **Step 4: Deploy**

```bash
# Run the deployment script
./deploy-widget-only.sh
```

---

## 📋 **What Gets Deployed**

### **Files Uploaded:**
- ✅ `index.html` - Updated widget (removes "View Profile" buttons)
- ✅ `images/` folder - All therapist photos

### **Files NOT Deployed:**
- ❌ `submit-booking.php` - Email handler (not needed for this deployment)
- ❌ `booking-thank-you.html` - Thank you page (not needed for this deployment)
- ❌ Documentation files

---

## 🔧 **Configuration Examples**

### **Example 1: cPanel/Shared Hosting**
```bash
DEPLOY_USER="unison_user"
DEPLOY_HOST="unisonmentalhealth.com"
DEPLOY_PATH="/public_html/therapair-widget"
```

### **Example 2: VPS/Dedicated Server**
```bash
DEPLOY_USER="root"
DEPLOY_HOST="123.456.789.0"
DEPLOY_PATH="/var/www/html/therapair-widget"
```

### **Example 3: Custom Path**
```bash
DEPLOY_USER="admin"
DEPLOY_HOST="server.unisonmentalhealth.com"
DEPLOY_PATH="/home/unison/public_html/therapair-widget"
```

---

## 🧪 **Testing After Deployment**

### **1. Visit Widget**
Go to: https://unisonmentalhealth.com/find-a-therapist-who-is-right-for-you/

### **2. Complete Quiz**
- Answer the questions to get to therapist results
- Verify the quiz works correctly

### **3. Check Therapist Cards**
- **Expected**: Only "Book Now" buttons (no "View Profile")
- **Images**: Therapist photos should display correctly
- **Layout**: Cards should look clean and professional

### **4. Test Booking Form**
- Click "Book Now" on a therapist
- Fill out the form
- Submit and verify it works (will use FormSubmit.co for now)

---

## 🆘 **Troubleshooting**

### **SSH Connection Issues**
```bash
# Test basic SSH connection
ssh your_username@your_server

# If connection fails, check:
# - Username is correct
# - Server hostname/IP is correct
# - SSH key is added to server
# - Server allows SSH connections
```

### **File Permission Issues**
```bash
# If files don't upload, check permissions on server:
ssh your_username@your_server "ls -la /public_html/therapair-widget/"

# Should show:
# -rw-r--r-- index.html
# drwxr-xr-x images/
```

### **Images Not Loading**
```bash
# Check if images exist on server:
ssh your_username@your_server "ls -la /public_html/therapair-widget/images/"

# Should show all .jpeg files:
# -rw-r--r-- adam.jpeg
# -rw-r--r-- natasha.jpeg
# etc.
```

---

## 🔄 **Deployment Process**

### **What the Script Does:**
1. ✅ **Validates** configuration and files
2. ✅ **Tests** SSH connection
3. ✅ **Creates** backup of current files
4. ✅ **Uploads** index.html
5. ✅ **Syncs** images/ folder
6. ✅ **Sets** correct file permissions
7. ✅ **Verifies** deployment

### **Backup System:**
- Creates timestamped backup before each deployment
- Backup location: `/public_html/therapair-widget/backups/`
- Can rollback if needed

---

## 📞 **Need Help?**

### **Common Issues:**
- **"SSH connection failed"** → Check username/hostname
- **"Files not found"** → Run from correct directory
- **"Permission denied"** → Check SSH key setup
- **"Images not loading"** → Check file permissions on server

### **Getting Server Details:**
If you don't know your server details, check:
- **Hosting control panel** (cPanel, Plesk, etc.)
- **Email from hosting provider**
- **Domain registrar** (for hostname)
- **Contact Unison's hosting admin**

---

## ✅ **Success Checklist**

After successful deployment:
- [ ] Widget loads at correct URL
- [ ] Quiz works correctly
- [ ] Only "Book Now" buttons show (no "View Profile")
- [ ] Therapist images display correctly
- [ ] Booking form works
- [ ] No console errors in browser

---

**Ready to deploy?** Update the configuration in `deploy-widget-only.sh` and run it! 🚀
