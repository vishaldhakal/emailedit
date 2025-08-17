# AI Email Generation Setup

This email editor now includes AI-powered email generation using Google's Gemini AI and real images from Pexels API.

## Setup Instructions

### 1. Get a Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### 2. Get a Pexels API Key (Optional but Recommended)

1. Go to [Pexels API](https://www.pexels.com/api/)
2. Sign up for a free account
3. Get your API key
4. Copy the generated API key

### 3. Configure Environment Variables

Create a `.env.local` file in your project root and add:

```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
PEXELS_API_KEY=your_actual_pexels_api_key_here
```

**Note:** Pexels API key is optional. If not provided, placeholder images will be used.

### 4. Restart Your Development Server

After adding the environment variables, restart your Next.js development server:

```bash
npm run dev
```

## How to Use

1. Click the "AI Generate Email" button in the header
2. Describe the email you want to create (e.g., "Create a promotional email for a summer sale")
3. Click "Generate Email"
4. The AI will create a complete email structure with appropriate components and real images
5. You can then edit and customize the generated email

## Example Prompts

- "Create a newsletter for a tech company with latest updates"
- "Design a promotional email for a restaurant with menu and booking button"
- "Generate a welcome email for new customers with product showcase"
- "Make an event invitation with RSVP button and venue details"
- "Create a summer sale email with product images and discount codes"

## Features

- ✅ AI-powered email generation
- ✅ Real images from Pexels API
- ✅ Automatic component creation
- ✅ Professional email structure
- ✅ Customizable after generation
- ✅ Auto-save functionality
- ✅ Drag and drop editing
- ✅ No HTML generation - pure component structure

## Image Integration

The AI system automatically:
- Analyzes your email description
- Determines what types of images are needed
- Searches Pexels for relevant high-quality images
- Integrates images seamlessly into the email structure

## Troubleshooting

If you encounter issues:

1. Make sure your API keys are correctly set in `.env.local`
2. Check that the API keys have proper permissions
3. Ensure you have sufficient API quota
4. Check the browser console for error messages
5. If Pexels API fails, placeholder images will be used automatically

## API Usage

- **Gemini AI**: Uses the Gemini Pro model for email structure generation
- **Pexels API**: Fetches relevant, high-quality images based on email content
- **Fallback**: Uses placeholder images if Pexels API is unavailable

## Cost Information

- **Gemini API**: Free tier available with generous limits
- **Pexels API**: Free tier with 200 requests per hour
- Both APIs are suitable for development and small to medium usage 