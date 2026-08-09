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
    const { userRequest, availableTrips } = await req.json();

    if (!userRequest || !availableTrips) {
      return new Response(JSON.stringify({ error: "Missing userRequest or availableTrips" }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const prompt = `You are an expert travel planner for the platform Travy. A user has requested a trip. I am providing you with the user's request, as well as a list of available packages from our database.
USER REQUEST: "${userRequest}"
AVAILABLE TRAVY DATABASE TRIPS: ${JSON.stringify(availableTrips)}
YOUR TASK:
1. Select the best matching trip from the AVAILABLE DATABASE TRIPS.
2. Generate a custom, engaging day-by-day itinerary based on that trip.
3. Generate search links for transportation based on the user's origin.
OUTPUT FORMAT: You must return strictly valid JSON in this format:
{
  "recommended_trip_id": "uuid-of-the-trip",
  "agency_name": "Name of the agency",
  "itinerary": [
    { "day": 1, "title": "Arrival", "description": "..." }
  ],
  "transportation": {
    "train_link": "https://www.makemytrip.com/railways/kolkata-siliguri-train-tickets.html",
    "flight_link": "https://www.google.com/travel/flights?q=Kolkata+to+Bagdogra",
    "irctc_portal": "https://www.irctc.co.in/"
  }
}`;

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
    console.error("Error generating trip plan:", error);
    return new Response(JSON.stringify({ error: "Failed to generate trip plan", details: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
