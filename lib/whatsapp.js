// Twilio WhatsApp integration for restaurant reservations
// Works automatically when reservations are submitted

// Check if using Twilio WhatsApp Sandbox
function isUsingSandbox() {
  const fromNumber = process.env.TWILIO_WHATSAPP_FROM;
  return fromNumber && fromNumber.includes('+14155238886');
}

// Get sandbox registration instructions
function getSandboxInstructions() {
  return {
    message: 'Phone number must be registered in Twilio WhatsApp Sandbox',
    steps: [
      '1. Open WhatsApp on your phone',
      '2. Send a message to: +1 415 523 8886',
      '3. Send the text: "join <your-sandbox-keyword>"',
      '4. Wait for confirmation message from Twilio',
      '5. Try your reservation again'
    ],
    consoleUrl: 'https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn',
    note: 'You can find your sandbox keyword in the Twilio Console'
  };
}

// Check if Twilio WhatsApp is configured
function isTwilioWhatsAppConfigured() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_WHATSAPP_FROM;
  return !!(accountSid && authToken && fromNumber);
}

// Format phone number for WhatsApp - Optimized for Cambodia
function formatPhoneNumber(phoneNumber) {
  // If already formatted with +, keep as is
  if (phoneNumber.startsWith('+')) {
    return phoneNumber;
  }
  
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
    cleanNumber = '+855' + cleanNumber;
  }
  // If it's exactly 10 digits, could be US format
  else if (cleanNumber.length === 10) {
    cleanNumber = '+1' + cleanNumber;
  }
  // If it already starts with 855 (Cambodia) or other country codes
  else if (cleanNumber.startsWith('855')) {
    cleanNumber = '+' + cleanNumber;
  }
  // For other short numbers, assume Cambodia
  else if (cleanNumber.length >= 6 && cleanNumber.length < 10) {
    cleanNumber = '+855' + cleanNumber;
  }
  // If already has country code but no +
  else if (cleanNumber.length >= 11) {
    cleanNumber = '+' + cleanNumber;
  }
  
  return cleanNumber;
}

// Validate phone number
function isValidPhoneNumber(phoneNumber) {
  const cleanNumber = formatPhoneNumber(phoneNumber);
  // Valid phone numbers should start with + and be between 10-15 digits
  return cleanNumber.startsWith('+') && cleanNumber.replace(/\D/g, '').length >= 10 && cleanNumber.replace(/\D/g, '').length <= 15;
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
      
      formattedTo = `whatsapp:${cleanNumber}`;
    }

    console.log(`📱 Sending WhatsApp to: ${formattedTo}`);

    // Important: Add sandbox warning for development
    if (fromNumber.includes('+14155238886')) {
      console.log('🧪 Using Twilio WhatsApp Sandbox - Phone number must be registered first!');
      console.log('📝 IMPORTANT: You must register your phone number in the sandbox:');
      console.log('   1. Open WhatsApp on your phone');
      console.log('   2. Send a message to +1 415 523 8886');
      console.log('   3. Send the text: "join <your-sandbox-keyword>"');
      console.log('   4. Wait for confirmation message');
      console.log('   5. Then try sending reservation again');
      console.log('🔗 Check sandbox keyword: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn');
    }

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
      
      // Check for common sandbox errors
      if (result.code === 63016) {
        console.error('🚨 SANDBOX ERROR: Phone number is NOT registered in WhatsApp sandbox!');
        console.error('📱 SOLUTION: Register your phone number first:');
        console.error('   1. Open WhatsApp and message +1 415 523 8886');
        console.error('   2. Send: "join <your-sandbox-keyword>"');
        console.error('   3. Wait for confirmation');
        console.error('   4. Then try again');
        console.error('🔗 Get sandbox keyword: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn');
      } else if (result.code === 21211) {
        console.error('🚨 INVALID PHONE NUMBER: Check the phone number format');
        console.error('📱 Expected format: +85569884948 (with country code)');
      } else if (result.code === 20003) {
        console.error('🚨 AUTHENTICATION ERROR: Check your Twilio credentials');
      }
      
      return { 
        success: false, 
        error: result.message || 'Failed to send WhatsApp message',
        code: result.code,
        details: result
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

    // Check if using sandbox and warn
    if (isUsingSandbox()) {
      console.log('🧪 Using Twilio WhatsApp Sandbox mode');
      const instructions = getSandboxInstructions();
      console.log(`📝 ${instructions.message}`);
      console.log('Steps to register:');
      instructions.steps.forEach(step => console.log(`   ${step}`));
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
    const result = await sendTwilioWhatsAppMessage({
      to: restaurantWhatsApp,
      message: message
    });

    // If sandbox error, provide specific instructions
    if (!result.success && result.code === 63016) {
      const instructions = getSandboxInstructions();
      console.error('❌ Cannot send WhatsApp - Phone not registered in sandbox!');
      console.error('📱 To fix this:');
      instructions.steps.forEach(step => console.error(`   ${step}`));
      console.error(`🔗 Console: ${instructions.consoleUrl}`);
    }

    return result;
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
    console.log('🧪 Testing Twilio WhatsApp integration...');
    
    const restaurantNumber = process.env.RESTAURANT_WHATSAPP_NUMBER;
    
    if (!restaurantNumber) {
      console.error('❌ RESTAURANT_WHATSAPP_NUMBER not configured');
      return false;
    }

    // Check if using sandbox
    if (isUsingSandbox()) {
      console.log('🧪 Using Twilio WhatsApp Sandbox');
      const instructions = getSandboxInstructions();
      console.log('📝 Make sure your phone number is registered:');
      instructions.steps.forEach(step => console.log(`   ${step}`));
      console.log(`🔗 Console: ${instructions.consoleUrl}`);
      console.log('');
    }

    const testMessage = `🧪 Test message from Tonle Sab Restaurant!

This is a test to verify WhatsApp integration is working correctly.

✅ If you receive this message, everything is set up properly!

Time: ${new Date().toLocaleString()}`;
    
    console.log(`📱 Testing with restaurant number: ${formatPhoneNumber(restaurantNumber)}`);
    
    const result = await sendTwilioWhatsAppMessage({
      to: restaurantNumber,
      message: testMessage
    });
    
    if (result.success) {
      console.log('✅ Test successful! Check your WhatsApp for the test message.');
    } else {
      console.error('❌ Test failed:', result.error);
      if (result.code === 63016) {
        console.error('');
        console.error('🚨 Your phone number is NOT registered in the Twilio sandbox!');
        console.error('📱 Follow these steps:');
        const instructions = getSandboxInstructions();
        instructions.steps.forEach(step => console.error(`   ${step}`));
      }
    }
    
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
  isValidPhoneNumber,
  isUsingSandbox,
  getSandboxInstructions
}; 