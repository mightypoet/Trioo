const fs = require('fs');
let code = fs.readFileSync('src/pages/GoSolo.tsx', 'utf8');

const targetStr = `  const searchFlights = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!originIata) return;
    setLoadingFlights(true);
    setErrorFlights('');
    try {
      const res = await fetch(\`/api/flights?dep_iata=\${originIata}\`);
      if (!res.ok) throw new Error('Failed to fetch flights');
      const data = await res.json();
      setFlights(data.data || []);
    } catch (err: any) {
      setErrorFlights(err.message || 'Error fetching flights.');
    } finally {
      setLoadingFlights(false);
    }
  };`;

const newStr = `  const searchFlights = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!originIata) return;
    setLoadingFlights(true);
    setErrorFlights('');
    try {
      const res = await fetch(\`/api/flights?dep_iata=\${encodeURIComponent(originIata)}\`);
      const contentType = res.headers.get("content-type");
      
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response. Please check server/API setup.");
      }
      
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error?.message || data.error || "Failed to load flights.");
      }
      
      setFlights(data.data || []);
    } catch (error: any) {
      console.error("Flight Search Error:", error);
      setErrorFlights(error.message || "Unable to fetch live flight data.");
      setFlights([]);
    } finally {
      setLoadingFlights(false);
    }
  };`;

code = code.replace(targetStr, newStr);

const errorBannerTarget = `{errorFlights && <p className="text-red-600 font-bold mb-4">{errorFlights}</p>}`;
const errorBannerNew = `{errorFlights && (
              <div className="bg-red-200 border-4 border-black p-4 rounded-xl font-bold text-[#0A0A0A] mb-4">
                {errorFlights}
              </div>
            )}`;

code = code.replace(errorBannerTarget, errorBannerNew);

fs.writeFileSync('src/pages/GoSolo.tsx', code);
