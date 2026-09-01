# ABITHA BEGUM - AI Chatbot Integration Guide

## Overview
**ABITHA BEGUM** is an AI chatbot assistant for your real estate platform. Currently, it uses demo responses but is ready to integrate with OpenAI's API.

## Current Features ✨
- 💬 Modal chat interface with message history
- 🎯 Floating button (bottom-right corner)
- 📱 Responsive design with smooth animations
- 🤖 Demo responses for common property queries
- ⌨️ Send messages with Enter key or button click

## How to Connect OpenAI 🔌

### Step 1: Get OpenAI API Key
1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up or log in
3. Navigate to **API keys** section
4. Click **Create new secret key**
5. Copy the key (keep it secret!)

### Step 2: Add to Environment Variables
1. Open `.env.local` in your project root
2. Add the following line:
```
NEXT_PUBLIC_OPENAI_API_KEY=sk-your-key-here
```

### Step 3: Update Chatbot Component
Replace the `getDemoResponse()` function in `src/components/chatbot/ChatBot.tsx` with:

```typescript
const getDemoResponse = async (userMessage: string): Promise<string> => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are ABITHA BEGUM, an AI assistant for EASTATE HUB, a real estate company in Chennai.
            
Company Info:
- Name: EASTATE HUB (RRR Housing)
- Properties: Villas, apartments, plots, commercial spaces
- Locations: Porur, Poonamallee, West Chennai
- Price Range: ₹24 lakhs to ₹1.2+ crores
- Certifications: RERA approved, DTCP/CMDA approved, ISO 27001:2013
- Specialties: End-to-end property handling, clear titles, site visits
- Contact: +91-XXXXXXXXXX

Help customers with:
1. Property inquiries (type, location, price)
2. Company information and certifications
3. Documentation and legal details
4. Site visit scheduling
5. Lead generation (collect contact info)
6. General support and questions

Be friendly, professional, and always encourage contacting the sales team for detailed information.`,
            
          },
          {
            role: 'user',
            content: userMessage,
          },
        ],
        temperature: 0.7,
        max_tokens: 150,
      }),
    })

    const data = await response.json()
    return data.choices[0].message.content
  } catch (error) {
    console.error('OpenAI API error:', error)
    return 'Sorry, I encountered an error. Please contact our team at +91-XXXXXXXXXX'
  }
}
```

### Step 4: Update handleSendMessage
Make the function `async` to handle the OpenAI call:

```typescript
const handleSendMessage = async () => {
  if (!input.trim()) return

  const userMessage: ChatMessage = {
    id: Date.now().toString(),
    role: 'user',
    content: input,
    timestamp: new Date(),
  }

  setMessages((prev) => [...prev, userMessage])
  setInput('')
  setIsLoading(true)

  try {
    const assistantResponse = await getDemoResponse(input)
    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: assistantResponse,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, assistantMessage])
  } catch (error) {
    console.error('Chat error:', error)
  } finally {
    setIsLoading(false)
  }
}
```

## Demo Responses (Current)
The chatbot automatically responds to:
- **Property prices & types** - Villas, apartments, plots, commercial
- **Locations** - Porur, Poonamallee, West Chennai
- **Documentation** - RERA, DTCP, CMDA approvals
- **Contact info** - Phone, enquiry forms, site visits
- **Offers & discounts** - Bulk purchases, early bookings
- **General greetings** - Hello, Hi, Hey

## Deployment Notes 🚀

### Production Best Practices
1. **Never expose API keys** - Always use backend routes for API calls
2. **Create API route** - Make a route handler at `src/app/api/chat/route.ts`
3. **Move logic server-side** - Process OpenAI calls on backend only

### Recommended Backend Route
Create `src/app/api/chat/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { message } = await req.json()

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // Use server env var
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are ABITHA BEGUM, an AI assistant for EASTATE HUB...',
        },
        { role: 'user', content: message },
      ],
      temperature: 0.7,
      max_tokens: 150,
    }),
  })

  const data = await response.json()
  return NextResponse.json({ response: data.choices[0].message.content })
}
```

Then in ChatBot component, call `/api/chat` instead of OpenAI directly.

## Troubleshooting 🔧

| Issue | Solution |
|-------|----------|
| API key not working | Check if key is valid and has remaining quota |
| Slow responses | OpenAI API can be slow; consider using gpt-4-turbo or caching responses |
| CORS errors | Make sure to use backend route (API route) instead of client-side API calls |
| High costs | Implement message caching, use cheaper models, or set usage limits |

## Next Steps 📋

1. ✅ Get OpenAI API key
2. ✅ Add to `.env.local`
3. ✅ Create API route for backend processing
4. ✅ Update ChatBot component
5. ✅ Test thoroughly
6. ✅ Deploy to production

---

**Need help?** Contact the development team or check OpenAI documentation at [platform.openai.com/docs](https://platform.openai.com/docs)
