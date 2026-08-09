export const config = { runtime: 'edge' };

import { GoogleGenAI } from "@google/genai";

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { 
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { rawDescription } = await req.json();

    if (!rawDescription) {
      return new Response(JSON.stringify({ error: "Missing rawDescription" }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const prompt = `You are an expert travel data structurer for Travy. Read the raw trip description provided by the agency. Extract and format the data into this EXACT JSON structure:
{
  "food_included": boolean (true if meals are mentioned),
  "transit_included": boolean (true if flights/trains are mentioned),
  "key_features": ["Feature 1", "Feature 2", "Feature 3"] (Exactly 3 short, punchy highlights),
  "itinerary": [
    { "day": 1, "title": "Day title", "description": "Short description" }
  ]
}
Return ONLY valid, parseable JSON.

RAW TRIP DESCRIPTION:
${rawDescription}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    if (!response.text) {
      throw new Error("No text returned from Gemini");
    }

    return new Response(response.text, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error("Error extracting trip data:", error);
    return new Response(JSON.stringify({ error: "Failed to extract trip data", details: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
