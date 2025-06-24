# Quick Setup for Real Email Sending

## 🚀 **Get Your Resend API Key (2 minutes)**

### Step 1: Sign Up
1. Go to: https://resend.com
2. Click "Sign Up" (FREE)
3. Use your email to create account

### Step 2: Get API Key
1. After signup, you'll see your API key
2. It starts with `re_` (like `re_abc123...`)
3. Copy it

### Step 3: Create Environment File
Create `.env.local` in your project root:

```env
RESEND_API_KEY=re_your_actual_api_key_here
RESTAURANT_EMAIL=tonlesab@email.com
NODE_ENV=production
```

### Step 4: Test
1. Restart your server: `npm run dev`
2. Submit a reservation form
3. **Real emails will be sent!**

## ✅ **What's Fixed:**

- ✅ Using Resend's verified sender email
- ✅ No domain verification needed
- ✅ Works immediately
- ✅ Real emails sent to customers
- ✅ Real emails sent to restaurant

## 🎯 **Current Status:**

Your system is ready! Just need your Resend API key to send real emails.

**No more development mode! No more console logging! Real emails delivered instantly!** 🎉 