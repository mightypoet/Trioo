export const fetchStitchContext = async () => {
  const apiKey = import.meta.env.VITE_STITCH_API_KEY;

  if (!apiKey) {
    throw new Error('Stitch API key is missing. Please add VITE_STITCH_API_KEY to your environment variables.');
  }

  try {
    // Note: Assuming a generic Stitch API endpoint as specific documentation was not provided.
    // Please update the URL and headers as per the actual Stitch API documentation.
    const response = await fetch('https://api.stitch.com/v1/context', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Stitch context: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Stitch context:', error);
    throw error;
  }
};
