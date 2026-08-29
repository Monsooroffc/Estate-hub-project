# AI Extension Point

This folder is reserved for future AI-powered features.

## Planned Features

1. **AI Lead Scoring** — `lead-scoring.ts`
   - Analyze lead data and assign priority scores automatically.

2. **AI Property Recommendations** — `recommendations.ts`
   - Suggest properties to customers based on enquiry history and preferences.

3. **AI Customer Chatbot** — `chatbot.ts`
   - Integrate an AI assistant for customer queries on the website.

4. **AI Enquiry Summarization** — `summarization.ts`
   - Auto-summarize long enquiry messages for quick admin review.

5. **AI Follow-up Suggestions** — `followups.ts`
   - Recommend optimal follow-up times and message templates.

6. **AI Marketing Content Generation** — `marketing.ts`
   - Generate property descriptions, social media posts, and email campaigns.

## Integration Pattern

Each feature should expose a clean async function interface:

```typescript
export async function scoreLead(lead: Lead): Promise<number> { ... }
export async function recommendProperties(customerId: string): Promise<Property[]> { ... }
```

These can be called from server actions or API routes without affecting the core UI.
