import { NextRequest, NextResponse } from 'next/server'
import { OpenAI } from 'openai'

// Initialize OpenAI client (server-side only)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// System prompt for ABITHA BEGUM AI
const SYSTEM_PROMPT = `You are ABITHA BEGUM AI, the official AI real-estate assistant for EstateHub.

Your role:
- Help customers understand available properties
- Answer general real-estate questions
- Explain property features and benefits
- Help customers find suitable properties
- Assist with location and property-type questions
- Encourage customers to contact EstateHub team when needed
- Help collect information for enquiries and site visits

Tone: Professional, friendly, helpful, concise, easy to understand

IMPORTANT RULES:
- Never invent property prices, availability, locations, dimensions, RERA/DTCP status, amenities, discounts, offers, or contact information
- If actual information is not available, clearly say customers should contact the EstateHub team
- Always provide accurate information only
- Redirect to human support for complex inquiries
- Keep responses concise (under 150 words)

Contact info to share: EstateHub Team (customers should contact the site for phone number and details)`

export async function POST(request: NextRequest) {
  try {
    // Validate API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { message } = body

    // Validate message exists
    if (!message || typeof message !== 'string' || message.trim() === '') {
      return NextResponse.json(
        { error: 'Message is required and must be a non-empty string' },
        { status: 400 }
      )
    }

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: message,
        },
      ],
      temperature: 0.7,
      max_tokens: 200,
    })

    // Extract the response content
    const assistantMessage = response.choices[0]?.message?.content

    if (!assistantMessage) {
      return NextResponse.json(
        { error: 'No response from OpenAI' },
        { status: 500 }
      )
    }

    // Return the response (never expose API key or internal details)
    return NextResponse.json({
      reply: assistantMessage,
    })
  } catch (error: unknown) {
    // Log error for debugging (server-side only)
    console.error('[Chatbot API Error]:', error)

    // Return generic error message (never expose internal details to client)
    return NextResponse.json(
      {
        error:
          'Sorry, I\'m having trouble connecting right now. Please try again or contact our EstateHub team.',
      },
      { status: 500 }
    )
  }
}
