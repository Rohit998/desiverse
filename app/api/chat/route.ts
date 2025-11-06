import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Gemini AI (free tier)
const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// Immigration-related keywords to check if question is relevant
const IMMIGRATION_KEYWORDS = [
  // Core immigration terms
  'immigration', 'immigrant', 'immigrants', 'emigration', 'emigrate', 'migrate', 'migration',
  'visa', 'visas', 'visa application', 'visa requirements', 'visa process',
  'citizenship', 'naturalization', 'naturalize', 'citizen',
  'residency', 'resident', 'permanent resident', 'pr status', 'green card',
  'work permit', 'work visa', 'employment visa', 'work authorization',
  'study permit', 'student visa', 'study abroad',
  'passport', 'passport application', 'passport renewal', 'travel document',
  'asylum', 'asylum seeker', 'refugee', 'refugee status',
  'documentation', 'documents', 'immigration documents', 'required documents',
  'application', 'immigration application', 'apply', 'applying',
  'immigration process', 'immigration procedure', 'immigration steps',
  
  // Immigration offices and agencies
  'consulate', 'consular', 'embassy', 'uscis', 'ircc', 'cic', 'immigration office',
  'immigration services', 'border agency', 'customs', 'immigration officer',
  
  // Legal and sponsorship terms
  'sponsorship', 'sponsor', 'sponsored', 'petition', 'petitioner',
  'immigration law', 'immigration lawyer', 'immigration attorney', 'immigration consultant',
  'immigration lawyer', 'immigration case', 'immigration appeal',
  
  // Status and timeline terms
  'immigration status', 'status check', 'application status', 'processing time',
  'processing times', 'wait time', 'timeline', 'immigration timeline',
  'entry', 'exit', 'entry visa', 'exit permit', 're-entry',
  'border', 'border crossing', 'port of entry',
  
  // Country and region specific
  'desi', 'south asian', 'south asia',
  'india', 'indian', 'pakistan', 'pakistani', 'bangladesh', 'bangladeshi',
  'sri lanka', 'sri lankan', 'nepal', 'nepali', 'nepalese',
  'canada', 'canadian', 'usa', 'united states', 'us', 'america', 'american',
  'uk', 'united kingdom', 'britain', 'british', 'australia', 'australian',
  
  // Life transition terms
  'moving', 'relocating', 'relocation', 'migrate', 'settle', 'settlement',
  'new country', 'abroad', 'overseas', 'expat', 'expatriate',
  'diaspora', 'immigrant community',
  
  // Specific visa types
  'family visa', 'family sponsorship', 'spousal visa', 'marriage visa',
  'skilled worker', 'express entry', 'points system', 'cr score',
  'investor visa', 'business visa', 'entrepreneur visa',
  'visitor visa', 'tourist visa', 'travel visa', 'temporary visa',
  'temporary resident', 'temporary status',
  
  // US visa types
  'f1', 'f-1', 'f1 visa', 'student visa f1', 'f1 student',
  'opt', 'optional practical training', 'opt extension', 'stem opt',
  'h1b', 'h-1b', 'h1b visa', 'h1b petition', 'h1b cap', 'h1b lottery',
  'h1b transfer', 'h1b extension', 'h1b renewal',
  'eb1', 'eb-1', 'eb1a', 'eb-1a', 'eb1b', 'eb-1b', 'eb1c', 'eb-1c',
  'eb2', 'eb-2', 'eb2 niw', 'eb-2 niw', 'eb2 perm', 'eb-2 perm',
  'eb3', 'eb-3', 'eb3 skilled worker', 'eb-3 skilled worker',
  'eb4', 'eb-4', 'eb4 special immigrant', 'eb-4 special immigrant',
  'eb5', 'eb-5', 'eb5 investor', 'eb-5 investor', 'eb5 visa', 'eb-5 visa',
  'employment based', 'employment-based', 'eb visa', 'eb category',
  'b1', 'b-1', 'b1 visa', 'b-1 visa', 'business visa b1', 'business visitor',
  'b2', 'b-2', 'b2 visa', 'b-2 visa', 'tourist visa b2', 'b2 tourist',
  'b1 b2', 'b-1 b-2', 'b1/b2', 'b-1/b-2', 'b1b2', 'b-1b-2',
  
  // Immigration categories
  'economic immigrant', 'family class', 'refugee class', 'humanitarian',
  'humanitarian and compassionate', 'h&c application',
  
  // Common immigration concerns
  'immigration interview', 'medical exam', 'medical examination', 'biometrics',
  'background check', 'security check', 'police clearance', 'criminal check',
  'language test', 'ielts', 'celpip', 'toefl', 'language requirements',
  'education credential', 'credential assessment', 'wes', 'iccas',
  'financial proof', 'proof of funds', 'bank statement', 'financial documents',
  'job offer', 'lmia', 'labour market impact assessment',
  
  // Immigration issues
  'immigration refusal', 'visa refusal', 'application refused', 'rejection',
  'immigration appeal', 'appeal process', 'judicial review',
  'immigration detention', 'removal', 'deportation', 'inadmissibility',
  
  // Settlement and integration
  'settlement services', 'integration', 'newcomer', 'landing', 'landed',
  'pr card', 'sin number', 'sin card', 'health card', 'driving license',
  'tax number', 'tax id', 'social insurance'
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

