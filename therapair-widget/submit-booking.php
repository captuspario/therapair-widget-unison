<?php
/**
 * Therapair Widget - Booking Submission Handler
 * Sends booking confirmation emails and syncs to Notion (future)
 */

// Prevent direct access
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: /');
    exit;
}

// ============================================
// CONFIGURATION
// ============================================
$ADMIN_EMAIL = 'tino@unisonmentalhealth.com';
$FROM_EMAIL = 'bookings@unisonmentalhealth.com';
$FROM_NAME = 'Unison Mental Health';
$WEBSITE_URL = 'https://unisonmentalhealth.com';

// OpenAI Configuration (for future AI emails)
$OPENAI_API_KEY = ''; // To be added later
$USE_AI_PERSONALIZATION = false; // Enable when ready

// ============================================
// HELPER FUNCTION
// ============================================
function sanitize($data) {
    return htmlspecialchars(strip_tags(trim($data)), ENT_QUOTES, 'UTF-8');
}

// ============================================
// GET FORM DATA
// ============================================
$fullName = isset($_POST['Full_Name']) ? sanitize($_POST['Full_Name']) : '';
$email = isset($_POST['Email']) ? sanitize($_POST['Email']) : '';
$phone = isset($_POST['Phone']) ? sanitize($_POST['Phone']) : '';
$selectedTherapist = isset($_POST['Selected_Therapist']) ? sanitize($_POST['Selected_Therapist']) : '';
$selectedSpecialty = isset($_POST['Selected_Specialty']) ? sanitize($_POST['Selected_Specialty']) : '';
$preferencesSummary = isset($_POST['Preferences_Summary']) ? sanitize($_POST['Preferences_Summary']) : '';
$userResponses = isset($_POST['User_Responses']) ? $_POST['User_Responses'] : '{}';
$timestamp = isset($_POST['Timestamp']) ? sanitize($_POST['Timestamp']) : date('Y-m-d H:i:s');

// Validate required fields
if (empty($fullName) || empty($email) || empty($selectedTherapist)) {
    header('Location: /?error=missing-fields');
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    header('Location: /?error=invalid-email');
    exit;
}

// ============================================
// 1. SEND ADMIN NOTIFICATION
// ============================================
$adminSubject = "📅 New Booking: {$selectedTherapist} - {$fullName}";

$adminMessage = "
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <style>
        body { font-family: 'Open Sans', Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #9B74B7, #4F064F); color: white; padding: 20px; border-radius: 12px 12px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #e2e8f0; }
        .field { margin: 15px 0; padding: 12px; background: #f8f4ff; border-radius: 8px; }
        .field strong { color: #4F064F; display: block; margin-bottom: 5px; }
        .footer { text-align: center; padding: 20px; color: #64748b; font-size: 0.875rem; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1 style='margin: 0; font-size: 24px;'>New Booking Request</h1>
            <p style='margin: 10px 0 0 0; opacity: 0.9;'>Therapair Widget - Unison Mental Health</p>
        </div>
        <div class='content'>
            <div class='field'>
                <strong>Selected Therapist:</strong>
                {$selectedTherapist}
            </div>
            
            <div class='field'>
                <strong>Client Name:</strong>
                {$fullName}
            </div>
            
            <div class='field'>
                <strong>Email:</strong>
                <a href='mailto:{$email}'>{$email}</a>
            </div>
            
            <div class='field'>
                <strong>Phone:</strong>
                <a href='tel:{$phone}'>{$phone}</a>
            </div>
            
            " . (!empty($selectedSpecialty) ? "
            <div class='field'>
                <strong>Specialty:</strong>
                {$selectedSpecialty}
            </div>
            " : "") . "
            
            <div class='field'>
                <strong>Preferences Summary:</strong>
                {$preferencesSummary}
            </div>
            
            <div class='field'>
                <strong>Submitted:</strong>
                {$timestamp}
            </div>
        </div>
        <div class='footer'>
            <p>This booking was submitted via the Therapair matching widget</p>
            <p>Please contact the client within 1 business day</p>
        </div>
    </div>
</body>
</html>
";

$adminHeaders = "From: {$FROM_NAME} <{$FROM_EMAIL}>\r\n";
$adminHeaders .= "Reply-To: {$email}\r\n";
$adminHeaders .= "MIME-Version: 1.0\r\n";
$adminHeaders .= "Content-Type: text/html; charset=UTF-8\r\n";
$adminHeaders .= "X-Mailer: Therapair Widget\r\n";
$adminHeaders .= "X-Priority: 2\r\n";

$adminSent = mail($ADMIN_EMAIL, $adminSubject, $adminMessage, $adminHeaders);

// ============================================
// 2. SEND USER CONFIRMATION EMAIL
// ============================================
$userSubject = 'Your booking request with Unison Mental Health';

$userMessage = formatUserConfirmationEmail($fullName, $email, $selectedTherapist, $preferencesSummary);

$userHeaders = "From: {$FROM_NAME} <{$FROM_EMAIL}>\r\n";
$userHeaders .= "Reply-To: {$ADMIN_EMAIL}\r\n";
$userHeaders .= "MIME-Version: 1.0\r\n";
$userHeaders .= "Content-Type: text/html; charset=UTF-8\r\n";
$userHeaders .= "X-Mailer: Therapair Widget\r\n";
$userHeaders .= "X-Priority: 3\r\n";

$userSent = mail($email, $userSubject, $userMessage, $userHeaders);

// ============================================
// 3. REDIRECT TO THANK YOU PAGE
// ============================================
if ($adminSent && $userSent) {
    header('Location: /therapair-widget/booking-thank-you.html?status=success');
} else {
    // Still redirect even if emails fail
    header('Location: /therapair-widget/booking-thank-you.html?status=sent');
}
exit;

// ============================================
// EMAIL TEMPLATE FUNCTION
// ============================================
function formatUserConfirmationEmail($name, $email, $therapist, $preferences) {
    $firstName = explode(' ', $name)[0];
    
    $html = '
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body { font-family: "Open Sans", Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; }
            .header { background: linear-gradient(135deg, #9B74B7, #4F064F); color: white; padding: 2rem; text-align: center; }
            .content { background: white; padding: 2rem; }
            .box { background: #F8F4FF; border-radius: 12px; padding: 1.5rem; margin: 1.5rem 0; }
            .footer { text-align: center; padding: 2rem; color: #64748b; font-size: 0.875rem; }
            .button { display: inline-block; padding: 12px 24px; background: #9B74B7; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 1rem 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 style="margin: 0; font-size: 28px;">Booking Request Confirmed! 🎉</h1>
            </div>
            <div class="content">
                <p style="font-size: 16px;"><strong>Hi ' . htmlspecialchars($firstName) . ',</strong></p>
                
                <p style="font-size: 15px; line-height: 1.8;">
                    We\'ve received your booking request.
                </p>
                
                <div class="box" style="background: #e8f5e9;">
                    <h4 style="margin-top: 0; color: #059669; font-size: 16px;">Your Selection:</h4>
                    <p style="margin: 8px 0; font-size: 15px;"><strong>Therapist:</strong> ' . htmlspecialchars($therapist) . '</p>
                    <p style="margin: 0; font-size: 14px; color: #374151;"><strong>Your Preferences:</strong><br>' . htmlspecialchars($preferences) . '</p>
                </div>
                
                <div class="box">
                    <h3 style="margin-top: 0; color: #4F064F; font-size: 18px;">What happens next?</h3>
                    <p style="margin: 8px 0; font-size: 15px;">✓ Our team will review your booking request</p>
                    <p style="margin: 8px 0; font-size: 15px;">✓ We\'ll contact you within <strong>1 business day</strong> to schedule your first session</p>
                    <p style="margin: 8px 0; font-size: 15px;">✓ We\'ll confirm the date, time, and format (online/in-person) that works best for you</p>
                </div>
                
                <p style="font-size: 15px;">If you have any urgent questions or need to make changes, please don\'t hesitate to reply to this email or call us.</p>
                
                <div style="text-align: center; margin: 2rem 0;">
                    <a href="https://unisonmentalhealth.com" class="button" style="color: white;">Visit Unison Mental Health</a>
                </div>
            </div>
            <div class="footer">
                <p style="margin-bottom: 1rem;"><strong>Warm regards,</strong><br>Unison Mental Health Team</p>
                <p style="margin-top: 15px;">
                    📧 <a href="mailto:tino@unisonmentalhealth.com" style="color: #9B74B7;">tino@unisonmentalhealth.com</a><br>
                    📞 <a href="tel:+610480706922" style="color: #9B74B7;">(+61) 0480 706 922</a><br>
                    🌐 <a href="https://unisonmentalhealth.com" style="color: #9B74B7;">unisonmentalhealth.com</a>
                </p>
                <p style="margin-top: 1rem; font-size: 0.75rem; color: #9ca3af;">
                    Powered by Therapair
                </p>
            </div>
        </div>
    </body>
    </html>
    ';
    
    return $html;
}

?>

