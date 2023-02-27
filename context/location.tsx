/**
 * @file context / location.tsx
 */

import { useContext, createContext, useState, useEffect } from 'react';
import { ResolveCoordinateReturn, ResolvedLocation, ResolveZipReturn } from '../lib/location';
import { useStatus, StatusEnum } from '../hooks/use-status';
import { useLocalStorage } from '../hooks/use-local-storage';

export type LocationContextProps = {
  geolocationAvailable: boolean;
  status: StatusEnum;
  statusMessage: string;
  savedLocations: ResolvedLocation[];
  currentLocationIndex: number;
  currentLocation: ResolvedLocation;
  empty: boolean;
  saveCoordinates: (lat: number, lon: number) => Promise<void>;
  saveZipCode: (zip: string, country: string) => Promise<void>;
  saveCity: (city: string, state: string, country: string) => Promise<void>;
  setCurrentLocationIndex: (index: number) => void;
  removeLocationIndex: (index: number) => void;
};

const LocationContext = createContext<LocationContextProps>({
  geolocationAvailable: false,
  status: StatusEnum.Idle,
  statusMessage: '',
  savedLocations: [],
  currentLocationIndex: 0,
  currentLocation: null,
  empty: false,
  saveCoordinates: null,
  saveZipCode: null,
  saveCity: null,
  setCurrentLocationIndex: null,
  removeLocationIndex: null
});

const LocationProvider = ({ children }) => {
  const status = useStatus();
  const [geolocationAvailable, setGeolocationAvailable] = useState<boolean>(false);
  const [savedLocations, setSavedLocations] = useLocalStorage<
    ResolvedLocation[]
  >("-ict-weather-saved-locations", []);
  const [currentIndex, setCurrentIndex] = useLocalStorage<
    number
  >("-ict-weather-current-location-index", 0);

  useEffect(() => {
    setGeolocationAvailable(!!navigator.geolocation);
  }, []);

  useEffect(() => {
    console.log(savedLocations, currentIndex);
  }, []);

  const updateSavedLocations = (newLocation: ResolvedLocation) => {
    const existingLocationIndex = savedLocations.findIndex((location) =>
      location.coord.lat === newLocation.coord.lat &&
      location.coord.lon === newLocation.coord.lon);

    if (existingLocationIndex === -1) {
      setSavedLocations([ ...savedLocations, newLocation ]);
      setCurrentIndex(savedLocations.length);
    } else {
      if (!savedLocations[existingLocationIndex].state) {
        const newSavedLocations = savedLocations.slice();
        newSavedLocations[existingLocationIndex].state = newLocation.state;
        setSavedLocations(newSavedLocations);
      }

      setCurrentIndex(existingLocationIndex);
    }
  };

  const saveCoordinates = async (lat: number, lon: number) => {
    status.setLoading("Resolving coordinates...");

    const res = await fetch('/api/location/coordinates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lat, lon })
    });

    if (res.ok === false) {
      status.setError(`${res.status}: ${res.statusText}`);
    }

    const data = await res.json() as ResolveCoordinateReturn;

    if (data.error) {
      status.setError(data.error);
    } else {
      updateSavedLocations(data.locations[0]);
    }
  };

  const saveZipCode = async (zip: string, country: string = 'US') => {
    status.setLoading("Resolving zip code...");

    const res = await fetch('/api/location/zip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ zip, country })
    });

    if (res.ok === false) {
      status.setError(`${res.status}: ${res.statusText}`);
    }

    const data = await res.json() as ResolveZipReturn;

    if (data.error) {
      status.setError(data.error);
    } else {
      updateSavedLocations(data.location);
    }
  };

  const saveCity = async (city: string, state: string, country: string) => {
    status.setLoading("Resolving city and state...");

    const res = await fetch('/api/location/city', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ city, state, country })
    });

    if (res.ok === false) {
      status.setError(`${res.status}: ${res.statusText}`);
    }

    const data = await res.json() as ResolveCoordinateReturn;

    if (data.error) {
      status.setError(data.error);
    } else {
      updateSavedLocations(data.locations[0]);
    }
  };

  const setCurrentLocationIndex = (index: number) => {
    if (index >= 0 && index < savedLocations.length) {
      setCurrentIndex(index);
    }
  };

  const removeLocationIndex = (index: number) => {
    if (index >= 0 && index < savedLocations.length) {
      const newSavedLocations = savedLocations.slice();
      newSavedLocations.splice(index, 1);
      setSavedLocations(newSavedLocations);
    }
  };

  return (
    <LocationContext.Provider value={{
      geolocationAvailable,
      status: status.status,
      statusMessage: status.message,
      savedLocations,
      currentLocationIndex: currentIndex,
      currentLocation: savedLocations[currentIndex],
      empty: savedLocations.length === 0,

      saveCoordinates,
      saveZipCode,
      saveCity,
      setCurrentLocationIndex,
      removeLocationIndex
    }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = () => useContext(LocationContext);
export default LocationProvider;
