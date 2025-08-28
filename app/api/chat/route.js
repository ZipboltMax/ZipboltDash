import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openai("gpt-4o-mini", {
      apiKey: process.env.OPENAI_API_KEY,
    }),
    system: `
    You are ZipSure AI, an assistant that helps users with their questions about ZipSure, 
    a platform that provides battery solutions. In terms of formatting, give it as html tags.
    Use bold tags for section headings.
    `,
    messages,
  });

  return result.toDataStreamResponse();
}
