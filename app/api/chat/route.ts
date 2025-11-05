import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Gemini AI (free tier)
const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// Immigration-related keywords to check if question is relevant
const IMMIGRATION_KEYWORDS = [
  'immigration', 'visa', 'visas', 'immigrant', 'immigrants', 'citizenship',
  'residency', 'permanent resident', 'green card', 'work permit', 'study permit',
  'passport', 'travel document', 'asylum', 'refugee', 'naturalization',
  'documentation', 'application', 'immigration process', 'consulate', 'embassy',
  'sponsorship', 'petition', 'immigration law', 'desi', 'india', 'pakistan',
  'bangladesh', 'sri lanka', 'nepal', 'moving', 'relocating', 'settle',
  'settlement', 'immigration status', 'entry', 'exit', 'border', 'customs'
];

// Check if the question is related to immigration
function isImmigrationRelated(question: string): boolean {
  const lowerQuestion = question.toLowerCase();
  return IMMIGRATION_KEYWORDS.some(keyword => lowerQuestion.includes(keyword));
}

export async function POST(req: NextRequest) {
  try {
    console.log('API Route called');
    console.log('API Key exists:', !!apiKey);
    
    // Check if API key is configured
    if (!genAI || !apiKey) {
      console.error('API key not configured');
      return NextResponse.json({
        error: 'Google Gemini API key is not configured. Please add GOOGLE_GEMINI_API_KEY to your .env.local file.'
      }, { status: 500 });
    }

    const { messages } = await req.json();
    console.log('Received messages:', messages);
    
    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'No messages provided' }, { status: 400 });
    }

    // Get the last user message
    const lastMessage = messages[messages.length - 1];
    const userQuestion = lastMessage.content;

    // Check if the question is immigration-related
    if (!isImmigrationRelated(userQuestion)) {
      return NextResponse.json({
        message: "I'm specialized in helping with immigration-related questions for Desi immigrants. I can assist you with:\n\n• Visa applications and requirements\n• Immigration documentation\n• Citizenship and residency processes\n• Work permits and study permits\n• Immigration timelines and procedures\n• General immigration guidance\n\nPlease ask me about immigration, visas, or related topics, and I'll be happy to help!"
      }, { status: 200 });
    }

    // Build conversation history for context
    const conversationHistory = messages
      .map((msg: any) => `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n');

    // System prompt to ensure the AI only answers immigration questions
    const systemPrompt = `You are DesiVerse AI, a helpful assistant specialized in immigration matters for Desi (South Asian) immigrants. Your role is to:

1. Provide accurate, helpful information about immigration processes, visas, documentation, and related topics
2. Focus specifically on immigration-related questions
3. Be empathetic and supportive, understanding the challenges immigrants face
4. Provide clear, step-by-step guidance when possible
5. If asked about non-immigration topics, politely redirect to immigration-related assistance

IMPORTANT: Only answer questions related to immigration, visas, citizenship, residency, travel documents, and related matters. If a question is not immigration-related, politely decline and redirect.

Current conversation:
${conversationHistory}

Assistant:`;

    // Get the Gemini model
    // First, try to list available models to see what's accessible
    console.log('Getting Gemini model...');
    
    let result;
    let response;
    let text;
    let lastError: any = null;
    
    // Try to list available models first
    let availableModels: string[] = [];
    try {
      console.log('Attempting to list available models...');
      // Try both v1 and v1beta API versions
      for (const apiVersion of ['v1', 'v1beta']) {
        try {
          const modelsResponse = await fetch(
            `https://generativelanguage.googleapis.com/${apiVersion}/models?key=${apiKey}`
          );
          if (modelsResponse.ok) {
            const modelsData = await modelsResponse.json();
            const models = modelsData.models || [];
            availableModels = models
              .filter((m: any) => m.supportedGenerationMethods?.includes('generateContent'))
              .map((m: any) => {
                // Extract model name - could be 'models/gemini-pro' or just 'gemini-pro'
                const name = m.name || '';
                return name.replace('models/', '').replace(/^models\//, '');
              })
              .filter((name: string) => name.length > 0);
            console.log(`Found ${availableModels.length} available models (${apiVersion}):`, availableModels);
            if (availableModels.length > 0) break;
          }
        } catch (e: any) {
          console.log(`Failed to list models from ${apiVersion}:`, e.message);
        }
      }
    } catch (e: any) {
      console.log('Could not list models:', e.message);
    }
    
    // Build list of models to try - prefer available models, fallback to common names
    const modelsToTry = availableModels.length > 0 
      ? availableModels 
      : [
          'models/gemini-pro',
          'models/gemini-1.5-pro',
          'models/gemini-1.5-flash',
          'gemini-pro',
          'gemini-1.5-pro',
          'gemini-1.5-flash',
          'gemini-1.0-pro',
          'gemini-1.0-pro-latest'
        ];
    
    for (const modelName of modelsToTry) {
      try {
        // Remove 'models/' prefix if present
        const cleanModelName = modelName.replace('models/', '');
        console.log(`Attempting to use model: ${cleanModelName}`);
        const model = genAI.getGenerativeModel({ model: cleanModelName });
        result = await model.generateContent(systemPrompt);
        response = await result.response;
        text = response.text();
        console.log(`✓ Successfully used model: ${cleanModelName}`);
        break; // Success, exit loop
      } catch (error: any) {
        console.log(`✗ Model ${modelName} failed:`, error.message);
        lastError = error;
        // Continue to next model
      }
    }
    
    if (!text) {
      // Provide helpful error message
      const errorMsg = lastError?.message || 'Unknown error';
      console.error('All models failed. Last error:', errorMsg);
      throw new Error(
        `Unable to access any Gemini models. ` +
        `Error: ${errorMsg}. ` +
        `Your API key may not have access to Gemini models, or the models have changed. ` +
        `Please verify your API key at: https://makersuite.google.com/app/apikey ` +
        `or try generating a new API key.`
      );
    }

    console.log('Gemini response received:', text.substring(0, 100) + '...');

    return NextResponse.json({ message: text }, { status: 200 });

  } catch (error: any) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate response' },
      { status: 500 }
    );
  }
}

