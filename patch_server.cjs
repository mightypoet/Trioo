const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const regex = /app\.post\("\/api\/plan-trip", async \(req, res\) => \{[\s\S]*?res\.status\(500\)\.json\(\{ error: "Failed to generate trip plan" \}\);\s*\}\s*\}\);/m;

const replacement = `app.post("/api/plan-trip", async (req, res) => {
    try {
      const { userRequest, availableTrips, originCity, peopleCount = 2 } = req.body;

      if (!userRequest || !availableTrips) {
        return res.status(400).json({ error: "Missing userRequest or availableTrips" });
      }

      const prompt = \`You are an elite AI Travel Agent. The user is planning a trip for \${peopleCount} people. You must calculate all budget estimates, hotel room requirements, and transport logistics specifically for a group of \${peopleCount}. 
Return the output in this EXACT JSON structure:
{
  "itinerary": [
    {
      "day": 1,
      "title": "Day 1 Title",
      "description": "Detailed description of the day.",
      "googleMapsSearchLink": "https://www.google.com/maps/search/?api=1&query=Location+Name"
    }
  ],
  "budgetBreakdown": {
    "perPerson": "₹X",
    "totalGroup": "₹Y (Calculated for \${peopleCount} people)",
    "accommodation": "Estimated total for hotels",
    "food": "Estimated total for meals",
    "localTransport": "Estimated total for cabs/transit"
  },
  "hotelSuggestions": [
    {
      "name": "Hotel Name",
      "type": "Budget/Luxury/Homestay",
      "estimatedPricePerNight": "₹X",
      "searchLink": "https://www.google.com/travel/hotels?q=Hotel+Name+Destination"
    }
  ],
  "transportation": {
    "flights": "https://www.google.com/travel/flights?q=Flights+to+Destination",
    "trains": "https://www.irctc.co.in/nget/train-search",
    "localAdvice": "Short tip on getting around (e.g., Rent a Scooty, hire a private cab for 5 people)."
  }
}
Return ONLY valid, parseable JSON.\`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      if (!response.text) {
        throw new Error("No text returned from Gemini");
      }

      res.json(JSON.parse(response.text));
    } catch (error) {
      console.error("Error generating trip plan:", error);
      res.status(500).json({ error: "Failed to generate trip plan" });
    }
  });`;

if (code.match(regex)) {
  code = code.replace(regex, replacement);
  fs.writeFileSync('server.ts', code);
  console.log("Replaced successfully!");
} else {
  console.log("Regex didn't match.");
}
