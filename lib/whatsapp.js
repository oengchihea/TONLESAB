// Twilio WhatsApp integration for restaurant reservations
// Works automatically when reservations are submitted

// Check if Twilio WhatsApp is configured
function isTwilioWhatsAppConfigured() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_WHATSAPP_FROM;
  return !!(accountSid && authToken && fromNumber);
}

// Format phone number for WhatsApp - Optimized for Cambodia
function formatPhoneNumber(phoneNumber) {
  // Remove all non-digits
  let cleanNumber = phoneNumber.replace(/\D/g, '');
  
  // Handle Cambodia phone number formats
  if (cleanNumber.startsWith('0')) {
    // Remove leading zero (common in Cambodia: 069884948 → 69884948)
    cleanNumber = cleanNumber.substring(1);
  }
  
  // Cambodia phone number handling
  if (cleanNumber.length === 8 || cleanNumber.length === 9) {
    // Add Cambodia country code 855
    cleanNumber = '855' + cleanNumber;
  }
  // If it's exactly 10 digits, could be US format
  else if (cleanNumber.length === 10) {
    cleanNumber = '1' + cleanNumber;
  }
  // If it already starts with 855 (Cambodia) or other country codes
  else if (cleanNumber.startsWith('855') || cleanNumber.length >= 11) {
    // Keep as is - already has country code
  }
  // For other short numbers, assume Cambodia
  else if (cleanNumber.length >= 6 && cleanNumber.length < 10) {
    cleanNumber = '855' + cleanNumber;
  }
  
  return cleanNumber;
}

// Validate phone number
function isValidPhoneNumber(phoneNumber) {
  const cleanNumber = formatPhoneNumber(phoneNumber);
  // Valid phone numbers should be between 10-15 digits
  return cleanNumber.length >= 10 && cleanNumber.length <= 15;
}

// Send WhatsApp message using Twilio API
async function sendTwilioWhatsAppMessage({ to, message }) {
  try {
    if (!isTwilioWhatsAppConfigured()) {
      console.warn('⚠️ Twilio WhatsApp credentials not configured. Skipping WhatsApp message.');
      console.log('📝 Add these to your .env file:');
      console.log('   TWILIO_ACCOUNT_SID=your_account_sid');
      console.log('   TWILIO_AUTH_TOKEN=your_auth_token');
      console.log('   TWILIO_WHATSAPP_FROM=whatsapp:+14155238886');
      console.log('   RESTAURANT_WHATSAPP_NUMBER=your_phone_number');
      return { success: false, error: 'Twilio WhatsApp not configured' };
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_WHATSAPP_FROM;

    // Format and validate phone number
    let formattedTo = to;
    if (!to.startsWith('whatsapp:')) {
      const cleanNumber = formatPhoneNumber(to);
      
      // Validate the phone number
      if (!isValidPhoneNumber(to)) {
        console.error(`❌ Invalid phone number: ${to} (formatted: ${cleanNumber})`);
        return { 
          success: false, 
          error: `Invalid phone number format: ${to}. Please use format: +1234567890 or 1234567890` 
        };
      }
      
      formattedTo = `whatsapp:+${cleanNumber}`;
    }

    console.log(`📱 Sending WhatsApp to: ${formattedTo}`);

    // Twilio API endpoint
    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    
    // Create basic auth header
    const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
    
    // Prepare form data
    const formData = new URLSearchParams();
    formData.append('From', fromNumber);
    formData.append('To', formattedTo);
    formData.append('Body', message);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData
    });

    const result = await response.json();

    if (response.ok) {
      console.log(`✅ WhatsApp message sent successfully to ${formattedTo}`);
      console.log(`📱 Message SID: ${result.sid}`);
      return { 
        success: true, 
        messageSid: result.sid,
        message: 'WhatsApp message sent successfully' 
      };
    } else {
      console.error('❌ Twilio API error:', result);
      return { 
        success: false, 
        error: result.message || 'Failed to send WhatsApp message',
        code: result.code 
      };
    }
  } catch (error) {
    console.error('❌ Error sending WhatsApp message:', error);
    return { success: false, error: error.message };
  }
}

// Send reservation notification to restaurant via WhatsApp
async function sendReservationNotification({
  name,
  phone,
  email,
  companyName,
  date,
  time,
  guests,
  requests,
  confirmationCode
}) {
  try {
    const restaurantWhatsApp = process.env.RESTAURANT_WHATSAPP_NUMBER;
    
    if (!restaurantWhatsApp) {
      console.warn('⚠️ RESTAURANT_WHATSAPP_NUMBER not set in environment variables');
      return { success: false, error: 'Restaurant WhatsApp number not configured' };
    }

    const message = `🍽️ *New Reservation Received*

👤 *Name:* ${name}
📞 *Phone:* ${phone}
✉️ *Email:* ${email}${companyName ? `\n🏢 *Company:* ${companyName}` : ''}

📅 *Date:* ${date}
⏰ *Time:* ${time}
👥 *Guests:* ${guests}
📝 *Special Requests:* ${requests || 'None'}

🔑 *Confirmation Code:* ${confirmationCode}

_Submitted via Tonle Sab Restaurant website_`;

    console.log('🏪 Sending reservation notification to restaurant via WhatsApp...');
    return await sendTwilioWhatsAppMessage({
      to: restaurantWhatsApp,
      message: message
    });
  } catch (error) {
    console.error('❌ Error sending reservation notification:', error);
    return { success: false, error: error.message };
  }
}

// Send confirmation message to customer via WhatsApp
async function sendCustomerConfirmation({
  name,
  phone,
  date,
  time,
  guests,
  confirmationCode
}) {
  try {
    const message = `🍽️ *Reservation Confirmation - Tonle Sab Restaurant*

Dear ${name},

Thank you for choosing Tonle Sab Restaurant! Your reservation has been received and is being processed.

📅 *Date:* ${date}
⏰ *Time:* ${time}
👥 *Guests:* ${guests}
🔑 *Confirmation Code:* ${confirmationCode}

If you need to modify or cancel your reservation, please contact us at:
📞 Phone: (123) 456-7890
✉️ Email: info@tonlesab.com

We look forward to serving you! 🥘✨`;

    console.log('👤 Sending WhatsApp confirmation to customer...');
    return await sendTwilioWhatsAppMessage({
      to: phone,
      message: message
    });
  } catch (error) {
    console.error('❌ Error sending customer confirmation:', error);
    return { success: false, error: error.message };
  }
}

// Test function to verify Twilio WhatsApp setup
async function testTwilioWhatsApp() {
  try {
    const testMessage = "🧪 Test message from Tonle Sab Restaurant reservation system!";
    const restaurantNumber = process.env.RESTAURANT_WHATSAPP_NUMBER;
    
    if (!restaurantNumber) {
      console.error('❌ RESTAURANT_WHATSAPP_NUMBER not configured');
      return false;
    }
    
    console.log('🧪 Testing Twilio WhatsApp integration...');
    const result = await sendTwilioWhatsAppMessage({
      to: restaurantNumber,
      message: testMessage
    });
    
    return result.success;
  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  }
}

module.exports = {
  sendTwilioWhatsAppMessage,
  sendReservationNotification,
  sendCustomerConfirmation,
  testTwilioWhatsApp,
  isTwilioWhatsAppConfigured,
  formatPhoneNumber,
  isValidPhoneNumber
}; 