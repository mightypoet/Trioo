const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  /const prompt = `You are an expert travel planner[\s\S]*?}`;/g,
  `const prompt = \`You are an expert travel planner for the platform Travy. A user has requested a trip. I am providing you with the user's request, as well as a list of available packages from our database.

USER REQUEST: "\${userRequest}"
AVAILABLE TRAVY DATABASE TRIPS: \${JSON.stringify(availableTrips)}

YOUR TASK:
1. Select the best matching trip from the AVAILABLE DATABASE TRIPS.
2. Generate a custom, engaging day-by-day itinerary based on that trip. Ensure you provide highly detailed, precise, and interactive data.
3. Generate search links for transportation based on the user's origin.

Based on the user's origin city and the package's destination city, you must generate real, clickable search URLs for transportation. Replace spaces with '+' in city names.
- For flights: Use Google Flights. Format: https://www.google.com/travel/flights?q=Flights+from+[ORIGIN]+to+[DESTINATION]
- For trains: Use MakeMyTrip. Format: https://www.makemytrip.com/railways/
- For IRCTC: Just return https://www.irctc.co.in/nget/train-search

OUTPUT FORMAT: You must return strictly valid JSON in this format. Ensure these three links are always populated in the transportation object:
{
  "recommended_trip_id": "uuid-of-the-trip",
  "agency_name": "Name of the agency",
  "itinerary": [
    { 
      "day": 1, 
      "title": "Arrival", 
      "description": "Overview of the day...",
      "spots": [
        {
          "spotName": "Exact name of the destination/attraction",
          "spotMapUrl": "https://www.google.com/maps/search/?api=1&query=EXACT_SPOT_NAME+LOCATION",
          "description": "Concise overview of activities and recommended stay duration.",
          "transitToNext": {
            "travelMode": "Driving",
            "estimatedDuration": "35 mins",
            "estimatedFare": "₹150 (Auto)",
            "routeMapUrl": "https://www.google.com/maps/dir/?api=1&origin=ORIGIN_SPOT&destination=DESTINATION_SPOT&travelmode=driving"
          }
        }
      ]
    }
  ],
  "budgetBreakdown": {
    "accommodation": "₹2000/night (Total: ₹4000)",
    "localTransport": "₹1500",
    "foodAndDining": "₹1000/day",
    "entryFeesAndActivities": "₹500",
    "miscellaneous": "₹1000",
    "totalEstimatedCost": "₹8000"
  },
  "transportation": {
    "train_link": "https://www.makemytrip.com/railways/",
    "flight_link": "https://www.google.com/travel/flights?q=...",
    "irctc_portal": "https://www.irctc.co.in/nget/train-search"
  }
}\`;`
);

fs.writeFileSync('server.ts', code);
