import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Get API key from environment variables
    const BREVO_API_KEY = process.env.BREVO_API_KEY
    const EMAIL_USER = process.env.EMAIL_USER

    // Enhanced debugging information
    console.log("==== BREVO TEST DEBUGGING ====")
    console.log("EMAIL_USER exists:", !!EMAIL_USER)
    console.log("EMAIL_USER value:", EMAIL_USER || "not set")
    console.log("BREVO_API_KEY exists:", !!BREVO_API_KEY)
    console.log("BREVO_API_KEY first 5 chars:", BREVO_API_KEY ? BREVO_API_KEY.substring(0, 5) + "..." : "not set")

    // Validate environment variables
    if (!BREVO_API_KEY) {
      return NextResponse.json({
        success: false,
        message: "BREVO_API_KEY is not set in environment variables",
        envVars: {
          EMAIL_USER_EXISTS: !!EMAIL_USER,
          BREVO_API_KEY_EXISTS: !!BREVO_API_KEY,
        },
      }, { status: 500 })
    }

    if (!EMAIL_USER) {
      return NextResponse.json({
        success: false,
        message: "EMAIL_USER is not set in environment variables",
        envVars: {
          EMAIL_USER_EXISTS: !!EMAIL_USER,
          BREVO_API_KEY_EXISTS: !!BREVO_API_KEY,
        },
      }, { status: 500 })
    }

    console.log("Creating test email...")
    // Create a test email
    const emailData = {
      sender: { name: "Tonle Sab Restaurant", email: EMAIL_USER },
      to: [{ email: EMAIL_USER, name: "Test Recipient" }],
      subject: "Brevo API Test - Tonle Sab Restaurant",
      htmlContent: `
        <html>
          <body>
            <h1 style="color: #e67e22;">Test Email</h1>
            <p>This is a test email from the Tonle Sab Restaurant reservation system using Brevo API.</p>
            <p>If you're seeing this, your email configuration is working correctly!</p>
            <p>Timestamp: ${new Date().toISOString()}</p>
            <p>Environment: ${process.env.NODE_ENV || "unknown"}</p>
          </body>
        </html>
      `
    }

    console.log("Sending test email...")
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": BREVO_API_KEY,
        "content-type": "application/json",
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
      console.error("Brevo API error response:", responseData)
      throw new Error(`Brevo API error: ${response.status} - ${JSON.stringify(responseData)}`)
    }

    console.log("Email sent successfully:", JSON.stringify(responseData))

    return NextResponse.json({
      success: true,
      message: "Email sent successfully via Brevo API!",
      messageId: responseData.messageId,
      timestamp: new Date().toISOString(),
      sentTo: EMAIL_USER,
    }, { status: 200 })
  } catch (error) {
    console.error("Error sending test email:", error)

    return NextResponse.json({
      success: false,
      message: "Failed to send test email",
      error: error.message,
      details: error.response?.body || null,
    }, { status: 500 })
  }
} 