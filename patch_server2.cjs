const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const oldDestStr = `      const { userRequest, availableTrips } = req.body;
      if (!userRequest || !availableTrips) {
        return res.status(400).json({ error: "Missing userRequest or availableTrips" });
      }`;
      
const newDestStr = `      const { userRequest, availableTrips, originCity } = req.body;
      if (!userRequest || !availableTrips) {
        return res.status(400).json({ error: "Missing userRequest or availableTrips" });
      }`;

code = code.replace(oldDestStr, newDestStr);

const originalInstruction = `1. Select the best matching trip from the AVAILABLE DATABASE TRIPS.`;
const newInstruction = `USER ORIGIN CONTEXT: The user's current detected location is '\${originCity}'. If the user's prompt does not explicitly state where they are traveling FROM, you MUST assume they are departing from '\${originCity}'. Use this origin city to accurately generate the transportation search links (Flights and Trains) to the selected package destination.

1. Select the best matching trip from the AVAILABLE DATABASE TRIPS.`;

code = code.replace(originalInstruction, newInstruction);

fs.writeFileSync('server.ts', code);
