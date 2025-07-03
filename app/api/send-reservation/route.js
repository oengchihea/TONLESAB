import { NextResponse } from 'next/server'
import { sendTelegramMessage } from '../../../lib/telegram'
import { sendReservationNotification } from '../../../lib/whatsapp'

export async function POST(request) {
  try {
    const body = await request.json()
    const { name, phone, email, companyName, date, time, guests, requests } = body

    // Validate required fields
    if (!name || !phone || !email || !date || !time || !guests) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Environment variables for Brevo
    const EMAIL_USER = process.env.EMAIL_USER
    const BREVO_API_KEY = process.env.BREVO_API_KEY
    const SENDER_NAME = process.env.SENDER_NAME || 'Tonle Sab Restaurant'
    const RESTAURANT_EMAIL = process.env.RESTAURANT_EMAIL || EMAIL_USER
    const NODE_ENV = process.env.NODE_ENV || 'development'

    if (!EMAIL_USER || !BREVO_API_KEY) {
      console.error('❌ EMAIL_USER or BREVO_API_KEY is not configured')
      return NextResponse.json(
        { error: 'Email service is not configured. Please contact support.' },
        { status: 503 }
      )
    }

    // Format date and time
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    })
    const formattedTime = new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric', minute: '2-digit', hour12: true
    })

    // Generate a unique confirmation code
    const confirmationCode = 'TS-' + Math.random().toString(36).substring(2, 8).toUpperCase()

    // Email HTML template for restaurant notification
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h1 style="color: #e67e22; border-bottom: 2px solid #e67e22; padding-bottom: 10px;">New Reservation Request - Tonle Sab Restaurant</h1>
        <div style="margin: 20px 0;">
          <h2 style="color: #333;">Customer Information</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          ${companyName ? `<p><strong>Company:</strong> ${companyName}</p>` : ''}
        </div>
        <div style="margin: 20px 0; padding: 15px; background-color: #f9f9f9; border-radius: 5px;">
          <h2 style="color: #333;">Reservation Details</h2>
          <p><strong>Date:</strong> ${formattedDate}</p>
          <p><strong>Time:</strong> ${formattedTime}</p>
          <p><strong>Number of Guests:</strong> ${guests}</p>
          <p><strong>Special Requests:</strong> ${requests || 'None'}</p>
        </div>
        <div style="margin-top: 20px; font-size: 14px; color: #666; border-top: 1px solid #e0e0e0; padding-top: 10px;">
          <p>This reservation was submitted through the Tonle Sab Restaurant website.</p>
        </div>
      </div>
    `

    // Plain text version for restaurant
    const textContent = `
      New Reservation Request - Tonle Sab Restaurant\n\nCustomer Information:\nName: ${name}\nEmail: ${email}\nPhone: ${phone}${companyName ? `\nCompany: ${companyName}` : ''}\n\nReservation Details:\nDate: ${formattedDate}\nTime: ${formattedTime}\nNumber of Guests: ${guests}\nSpecial Requests: ${requests || 'None'}\n\nThis reservation was submitted through the Tonle Sab Restaurant website.\n`

    // Confirmation email for customer
    const confirmationHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h1 style="color: #e67e22; border-bottom: 2px solid #e67e22; padding-bottom: 10px;">Reservation Confirmation - Tonle Sab Restaurant</h1>
        <div style="margin: 20px 0;">
          <p>Dear ${name},</p>
          <p>Thank you for choosing Tonle Sab Restaurant. Your reservation has been received and is being processed.</p>
        </div>
        <div style="margin: 20px 0; padding: 15px; background-color: #f9f9f9; border-radius: 5px;">
          <h2 style="color: #333;">Your Reservation Details</h2>
          <p><strong>Date:</strong> ${formattedDate}</p>
          <p><strong>Time:</strong> ${formattedTime}</p>
          <p><strong>Number of Guests:</strong> ${guests}</p>
          <p><strong>Confirmation Code:</strong> ${confirmationCode}</p>
        </div>
        <div style="margin: 20px 0;">
          <p>If you need to modify or cancel your reservation, please contact us at:</p>
          <p>Phone: (123) 456-7890</p>
          <p>Email: ${RESTAURANT_EMAIL}</p>
        </div>
        <div style="margin-top: 20px; font-size: 14px; color: #666; border-top: 1px solid #e0e0e0; padding-top: 10px;">
          <p>We look forward to serving you at Tonle Sab Restaurant!</p>
        </div>
      </div>
    `

    const confirmationText = `
      Reservation Confirmation - Tonle Sab Restaurant\n\nDear ${name},\n\nThank you for choosing Tonle Sab Restaurant. Your reservation has been received and is being processed.\n\nYour Reservation Details:\nDate: ${formattedDate}\nTime: ${formattedTime}\nNumber of Guests: ${guests}\nConfirmation Code: ${confirmationCode}\n\nIf you need to modify or cancel your reservation, please contact us at:\nPhone: (123) 456-7890\nEmail: ${RESTAURANT_EMAIL}\n\nWe look forward to serving you at Tonle Sab Restaurant!\n`

    // Helper function to send email using Brevo API directly
    async function sendEmailDirect(options) {
      try {
        const emailData = {
          sender: { name: options.senderName || SENDER_NAME, email: EMAIL_USER },
          to: [{ email: options.to, name: options.toName || options.to }],
          subject: options.subject,
          htmlContent: options.html,
        }
        if (options.text) {
          emailData.textContent = options.text
        }
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            accept: 'application/json',
            'api-key': BREVO_API_KEY,
            'content-type': 'application/json',
          },
          body: JSON.stringify(emailData),
        })
        const responseText = await response.text()
        let responseData
        try {
          responseData = JSON.parse(responseText)
        } catch (e) {
          responseData = { rawResponse: responseText }
        }
        if (!response.ok) {
          throw new Error(`Brevo API error: ${response.status} - ${JSON.stringify(responseData)}`)
        }
        return responseData
      } catch (error) {
        console.error('Error sending email with Brevo:', error)
        throw error
      }
    }

    // Send notification to restaurant
    try {
      await sendEmailDirect({
        to: RESTAURANT_EMAIL,
        subject: `New Reservation Request from ${name}`,
        html: htmlContent,
        text: textContent,
        senderName: SENDER_NAME,
      })
    } catch (notifyError) {
      console.error('Failed to send notification email to restaurant:', notifyError)
      // Continue to send confirmation email even if notification fails
    }

    // Send Telegram notification
    try {
      const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
      const TELEGRAM_CHAT_IDS = process.env.TELEGRAM_CHAT_IDS
      if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_IDS) {
        const chatIds = TELEGRAM_CHAT_IDS.split(',').map(id => id.trim())
        const telegramText = `🍽️ <b>New Reservation Received</b>\n\n<b>👤 Name:</b> ${name}\n<b>📞 Phone:</b> ${phone}\n<b>✉️ Email:</b> ${email}${companyName ? `\n<b>🏢 Company:</b> ${companyName}` : ''}\n<b>📅 Date:</b> ${formattedDate}\n<b>⏰ Time:</b> ${formattedTime}\n<b>👥 Guests:</b> ${guests}\n<b>📝 Requests:</b> ${requests || 'None'}\n<b>🔑 Confirmation Code:</b> <code>${confirmationCode}</code>\n\n<em>Submitted via Tonle Sab Restaurant website</em>`
        for (const chatId of chatIds) {
          await sendTelegramMessage({
            chatId,
            text: telegramText,
            botToken: TELEGRAM_BOT_TOKEN,
          })
        }
      } else {
        console.warn('TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_IDS not set. Skipping Telegram notification.')
      }
    } catch (telegramError) {
      console.error('Failed to send Telegram notification:', telegramError)
      // Continue even if Telegram notification fails
    }

    // Send WhatsApp notification to restaurant
    try {
      console.log('🏪 Attempting to send WhatsApp notification to restaurant...')
      const whatsappResult = await sendReservationNotification({
        name,
        phone,
        email,
        companyName,
        date: formattedDate,
        time: formattedTime,
        guests,
        requests,
        confirmationCode
      })
      
      if (whatsappResult.success) {
        console.log('✅ Restaurant WhatsApp notification sent successfully')
      } else {
        console.error('❌ Restaurant WhatsApp notification failed:', whatsappResult.error)
      }
    } catch (whatsappError) {
      console.error('Failed to send WhatsApp notification to restaurant:', whatsappError)
      // Continue even if WhatsApp notification fails
    }

    // Send confirmation email to customer
    try {
      await sendEmailDirect({
        to: email,
        toName: name,
        subject: 'Your Reservation at Tonle Sab Restaurant is Confirmed',
        html: confirmationHtml,
        text: confirmationText,
        senderName: SENDER_NAME,
      })
    } catch (confirmError) {
      console.error('Error sending confirmation email:', confirmError)
      // Continue even if confirmation email fails
    }

    // Skip WhatsApp confirmation to customer - only send to restaurant per requirements
    console.log('ℹ️ Customer WhatsApp confirmation disabled - only sending to restaurant')

    return NextResponse.json(
      {
        message: 'Reservation request sent successfully! Check your email for confirmation.',
        success: true,
        confirmationCode,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('❌ Error sending reservation:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error.message,
      },
      { status: 500 }
    )
  }
} 