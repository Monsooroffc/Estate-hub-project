import OpenAI from 'openai'

// Runtime configuration for Vercel
export const runtime = 'nodejs'

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

export async function POST(request: Request) {
  try {
    // Get API key from environment (runtime only, not at build time)
    const apiKey = process.env.OPENAI_API_KEY

    // Validate API key is configured
    if (!apiKey) {
      console.error('[Chatbot API] ❌ OPENAI_API_KEY is not configured')
      return Response.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      )
    }

    if (apiKey === 'sk-your-actual-key-here') {
      console.error('[Chatbot API] ❌ OPENAI_API_KEY is still a placeholder')
      return Response.json(
        { error: 'OpenAI API key is not properly configured' },
        { status: 500 }
      )
    }

    console.log('[Chatbot API] ✅ OPENAI_API_KEY is configured')

    // Parse request body
    const body = await request.json()
    const message = body?.message

    console.log('[Chatbot API] Received message')

    // Validate message exists
    if (!message || typeof message !== 'string' || message.trim() === '') {
      console.error('[Chatbot API] ❌ Message validation failed')
      return Response.json(
        { error: 'Message is required and must be a non-empty string' },
        { status: 400 }
      )
    }

    // Initialize OpenAI client (inside POST function for Vercel compatibility)
    const client = new OpenAI({
      apiKey,
    })

    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini'
    console.log('[Chatbot API] Using model:', model)

    // Call OpenAI API
    console.log('[Chatbot API] Calling OpenAI API...')
    const response = await client.chat.completions.create({
      model,
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

    console.log('[Chatbot API] ✅ OpenAI response received')

    // Extract the response content
    const assistantMessage = response.choices[0]?.message?.content

    if (!assistantMessage) {
      console.error('[Chatbot API] ❌ No content in OpenAI response')
      return Response.json(
        { error: 'No response from OpenAI' },
        { status: 500 }
      )
    }

    console.log('[Chatbot API] ✅ Returning response to client')

    // Return the response (never expose API key or internal details)
    return Response.json({
      reply: assistantMessage,
    })
  } catch (error: unknown) {
    // Log error for debugging (server-side only)
    console.error('[Chatbot API] ❌ Error occurred')

    // Try to extract useful error info without exposing secrets
    if (error instanceof Error) {
      console.error('[Chatbot API] Error:', error.message)

      // Check for specific OpenAI errors
      if (error.message.includes('401') || error.message.includes('authentication')) {
        console.error('[Chatbot API] 🔐 Authentication failed - check if OPENAI_API_KEY is valid')
      } else if (error.message.includes('404') || error.message.includes('model')) {
        console.error('[Chatbot API] 🤖 Model not found - check OPENAI_MODEL value')
      } else if (error.message.includes('429')) {
        console.error('[Chatbot API] ⏱️ Rate limited - try again in a moment')
      } else if (error.message.includes('Network') || error.message.includes('ECONNREFUSED')) {
        console.error('[Chatbot API] 🌐 Network error - check internet connection')
      }
    } else {
      console.error('[Chatbot API] Unknown error:', error)
    }

    // Return generic error message (never expose internal details to client)
    return Response.json(
      {
        error:
          'Sorry, I\'m having trouble connecting right now. Please try again or contact our EstateHub team.',
      },
      { status: 500 }
    )
  }
}
