import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { findBestFAQMatch, FALLBACK_MESSAGE } from '@/lib/faqMatcher';

// Server-side environment variables (never sent to client)
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY?.trim();
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL?.trim() || 'deepseek-chat';

// Initialize OpenAI client pointed to DeepSeek if key is present
const deepseekClient = DEEPSEEK_API_KEY
  ? new OpenAI({
      apiKey: DEEPSEEK_API_KEY,
      baseURL: 'https://api.deepseek.com',
      timeout: 8000, // 8 second timeout to prevent hanging
    })
  : null;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query = typeof body.message === 'string' ? body.message.trim() : '';

    if (!query) {
      return NextResponse.json(
        {
          answer: 'Please type a question or select an action from the menu.',
          confidence: 0,
          source: 'local',
          isFallback: false,
          suggestedFollowUps: ['How do I enroll in a course?', 'Which trainings are mandatory?', 'Talk to HR'],
        },
        { status: 400 }
      );
    }

    // Limit incoming query length for safety
    const sanitizedQuery = query.slice(0, 500);

    // 1. Search local FAQ knowledge base first
    const matchResult = findBestFAQMatch(sanitizedQuery);

    // If local match indicates insufficient confidence, return configured fallback directly
    if (matchResult.isFallback) {
      return NextResponse.json({
        answer: FALLBACK_MESSAGE,
        confidence: matchResult.confidence,
        source: 'local',
        isFallback: true,
        matchedFaq: null,
        suggestedFollowUps: matchResult.suggestedFollowUps,
      });
    }

    // 2. If DeepSeek is configured and matched FAQ is found, generate grounded response
    if (deepseekClient && matchResult.faq) {
      try {
        const completion = await deepseekClient.chat.completions.create({
          model: DEEPSEEK_MODEL,
          messages: [
            {
              role: 'system',
              content: `You are Lumi, the Learning & Development Assistant for NovaEdge Technologies (Pvt) Ltd, an IT services company in Sri Lanka.
Tone: Warm, friendly, helpful, professional, encouraging.
Strict rules:
1. Answer strictly using the provided FAQ knowledge base reference below.
2. Keep your response concise (strictly under 100 words).
3. Do NOT make up any policies, amounts, dates, or contacts not provided.
4. If you mention contact details, use only learning@novaedge.example or extension 214.
5. All company policies are fictional prototype rules.

Reference FAQ:
Category: ${matchResult.faq.category}
Question: ${matchResult.faq.question}
Verified Answer: ${matchResult.faq.answer}`,
            },
            {
              role: 'user',
              content: sanitizedQuery,
            },
          ],
          temperature: 0.3,
          max_tokens: 220,
        });

        const aiResponse = completion.choices[0]?.message?.content?.trim();

        if (aiResponse) {
          return NextResponse.json({
            answer: aiResponse,
            confidence: matchResult.confidence,
            source: 'deepseek',
            isFallback: false,
            matchedFaq: matchResult.faq,
            suggestedFollowUps: matchResult.suggestedFollowUps,
          });
        }
      } catch (apiError) {
        // Log on server and seamlessly fallback to local FAQ response
        console.warn('DeepSeek API request failed or timed out. Falling back to local FAQ engine.', apiError);
      }
    }

    // 3. Fallback: Return verified local FAQ answer (instant, zero network latency)
    return NextResponse.json({
      answer: matchResult.answer,
      confidence: matchResult.confidence,
      source: 'local',
      isFallback: false,
      matchedFaq: matchResult.faq,
      suggestedFollowUps: matchResult.suggestedFollowUps,
    });
  } catch (error) {
    console.error('Chat API route error:', error);
    return NextResponse.json({
      answer: FALLBACK_MESSAGE,
      confidence: 0,
      source: 'local',
      isFallback: true,
      suggestedFollowUps: ['How do I enroll in a course?', 'Which trainings are mandatory?', 'Talk to HR'],
    });
  }
}
