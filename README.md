# DesiVerse

An Immigration assistant app for Desi immigrants.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Get a free Google Gemini API key:
   - Visit: https://makersuite.google.com/app/apikey
   - Create a free API key

3. Create a `.env.local` file in the root directory:
```env
GOOGLE_GEMINI_API_KEY=your_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

## Features

- **AI-Powered Chat**: Uses Google Gemini (free tier) for intelligent responses
- **Topic Restriction**: Only answers immigration-related questions
- **Desi-Focused**: Specialized for South Asian immigrants
- **Real-time Responses**: Streaming chat interface

## Supported Topics

The AI will only respond to questions about:
- Visa applications and requirements
- Immigration documentation
- Citizenship and residency processes
- Work permits and study permits
- Immigration timelines and procedures
- General immigration guidance 
