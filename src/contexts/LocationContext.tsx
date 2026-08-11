import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LocationContextType {
  userLocation: string | null;
  isLoadingLocation: boolean;
  requestUserLocation: () => Promise<string | null>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [userLocation, setUserLocation] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const requestUserLocation = (): Promise<string | null> => {
    return new Promise((resolve) => {
      if (userLocation) {
        resolve(userLocation);
        return;
      }

      if (!navigator.geolocation) {
        console.warn('Geolocation is not supported by your browser');
        resolve(null);
        return;
      }

      setIsLoadingLocation(true);

      const timeoutId = setTimeout(() => {
        setIsLoadingLocation(false);
        console.warn('Geolocation request timed out');
        resolve(null);
      }, 5000);

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          clearTimeout(timeoutId);
          try {
            const { latitude, longitude } = position.coords;
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            const city = data.address.city || data.address.town || data.address.state;
            
            if (city) {
              setUserLocation(city);
              resolve(city);
            } else {
              resolve(null);
            }
          } catch (error) {
            console.error('Error fetching location details:', error);
            resolve(null);
          } finally {
            setIsLoadingLocation(false);
          }
        },
        (error) => {
          clearTimeout(timeoutId);
          console.warn('Geolocation access denied or failed:', error.message || error);
          setIsLoadingLocation(false);
          resolve(null);
        },
        { timeout: 5000 }
      );
    });
  };

  return (
    <LocationContext.Provider value={{ userLocation, isLoadingLocation, requestUserLocation }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocationContext() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
}
