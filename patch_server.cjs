const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const regex = /YOUR TASK:([\s\S]*?)OUTPUT FORMAT:/;
const replacement = `YOUR TASK:
1. Select the best matching trip from the AVAILABLE DATABASE TRIPS.
CRITICAL DESTINATION MATCHING: Analyze the user's prompt to identify the exact destination they are requesting. You MUST select a base trip from the provided DATABASE TRIPS where the destination geographically matches the user's request. Do NOT recommend a package for a completely different state or region (e.g., do not recommend Tripura if the user asked for Meghalaya). Only fallback to a different region if absolutely no logical match exists.
2. Generate a custom, engaging day-by-day itinerary based on that trip. Ensure you provide highly detailed, precise, and interactive data.
3. Generate search links for transportation based on the user's origin.

Based on the user's origin city and the package's destination city, you must generate real, clickable search URLs for transportation. Replace spaces with '+' in city names.
- For flights: Use Google Flights. Format: https://www.google.com/travel/flights?q=Flights+from+[ORIGIN]+to+[DESTINATION]
- For trains: Use MakeMyTrip. Format: https://www.makemytrip.com/railways/
- For IRCTC: Just return https://www.irctc.co.in/nget/train-search

OUTPUT FORMAT:`;

code = code.replace(regex, replacement);
fs.writeFileSync('server.ts', code);
