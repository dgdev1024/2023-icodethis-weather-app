/**
 * @file context / weather.tsx
 */

import { CountryCode } from 'openweathermap-ts/dist/types';
import { useState, useEffect, useContext, createContext } from 'react';
import { useLocalStorage } from '../hooks/use-local-storage';
import { WeatherResponse, WeatherData } from '../pages/api/weather';

export type CachedWeatherData = {
  locationId: number,
  data: WeatherData | null
};

export type WeatherContextProps = {
  loading: Boolean;
  error: String;
  weatherData: CachedWeatherData[];

  updateLocationWeather: (locationId: Number) => Promise<void>;
  addCoordinate: (latitude: number, longitude: number) => Promise<void>;
  addZipCode: (zip: number, country: CountryCode) => Promise<void>;
  addCity: (city: string, state: string, country: CountryCode) => Promise<void>;
};

// Create the weather context.
const WeatherContext = createContext<WeatherContextProps>({
  loading: false,
  error: "",
  weatherData: [],
  updateLocationWeather: async (locationId: Number) => {},
  addCoordinate: async (latitude: number, longitude: number) => {},
  addZipCode: async (zip: number, country: CountryCode) => {},
  addCity: async (city: string, state: string, country: CountryCode) => {}
});

// Create the weather provider.
const WeatherProvider = ({ children }) => {
  const [locationIds, setLocationIds] = useLocalStorage<number[]>("-ict-weather-location-ids", []);
  const [loading, setLoading] = useState<Boolean>(false);
  const [error, setError] = useState<String>("");
  const [weatherData, setWeatherData] = useState<CachedWeatherData[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Effect hook to populate the weather data array with blank data, based on
  // the location ID numbers in local storage.
  useEffect(() => {
    const blankWeatherData: CachedWeatherData[] =
      locationIds.map((locationId) => ({ locationId, data: null }));

    setWeatherData(blankWeatherData);
  }, []);

  // Effect hook to update the weather data entry at the current index with the
  // most recent forecast data.
  useEffect(() => {
    // Do nothing if the current index is out of range. The weather data array
    // may be empty in this case.
    if (currentIndex >= weatherData.length) {
      return;
    }

    const asyncWrapper = async () => {
      // Get the location ID mapped to this index.
      const locationId = locationIds[currentIndex];

      // Update the weather data for that location ID.
      await updateLocationWeather(locationId);
    };

    asyncWrapper();
  }, [currentIndex]);

  /**
   * Updates the weather data for the location with the given numeric ID.
   * @param locationId The numeric location ID of the cached weather location.
   */
  const updateLocationWeather = async (locationId: number) => {
    // Set loading and reset error.
    setLoading(true);
    setError('');

    // First, make sure the weatherData array has an entry with this location ID.
    const locationIndex = weatherData.findIndex((weatherEntry) =>
      weatherEntry.locationId === locationId);
    if (locationIndex === -1) {
      setError(`Location ID ${locationId} not found.`);
      setLoading(false);
      return;
    }

    try {
      // Query the weather API for the updated weather data.
      const res = await fetch(`/api/weather?id=${locationId}`);
      if (res.ok === false) { throw new Error(`${res.status}: ${res.statusText}`); }

      // Make sure the data is OK.
      const data = await res.json() as WeatherResponse;
      if (data.error) { throw new Error(data.error); }

      // Slice the array and update the relevant entry.
      const sliced = weatherData.slice();
      sliced[locationIndex].data = data.weather;

      // Update state.
      setWeatherData(sliced);
      setLoading(false);
    } catch (err) {
      console.error(err.message || err);
      setError("Something went wrong. Try again later.");
      setLoading(false);
    }
  };

  /**
   * Adds a new weather location based on the given latitude and longitude
   * coordinates.
   * @param latitude The latitude coordniate.
   * @param longitude The longitude coordinate.
   */
  const addCoordinate = async (latitude: number, longitude: number) => {
    // Reset state.
    setError(''); setLoading(true);

    try {
      // Fetch weather data for this location.
      const res = await fetch(`/api/weather`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latitude, longitude })
      });
      if (res.ok === false) { throw new Error(`${res.status}: ${res.statusText}`); }

      // Make sure the retrieved data is OK.
      const data = await res.json() as WeatherResponse;
      if (data.error) { throw new Error(data.error); }

      // Get the location ID of the fetched weather data. Check to see if that ID is
      // in our local storage.
      const locationId = data.weather.city.id;
      const locationIndex = locationIds.findIndex(id => locationId === id);
      if (locationIndex !== -1) {
        // If that location ID is present, then update the weather data entry at that
        // index.
        const sliced = weatherData.slice();
        sliced[locationIndex].data = data.weather;
        setWeatherData(sliced);

        // Update the index of the currently shown weather data.
        setCurrentIndex(locationIndex);
      } else {
        // Insert the location ID into local storage.
        setLocationIds([ ...locationIds, locationId ]);

        // Insert the weather data now.
        setWeatherData([ ...weatherData, {
          locationId, data: data.weather
        }]);

        // Update the index of the currently shown weather data.
        setCurrentIndex(weatherData.length - 1);
      }

      setLoading(false);
    } catch (err) {
      console.error(err.message || err);
      setError("Something went wrong. Try again later.");
      setLoading(false);
    }
  };

  const addZipCode = async (zip: number, country: CountryCode = "US") => {
    // Reset state.
    setError(''); setLoading(true);

    try {
      // Fetch weather data for this location.
      const res = await fetch(`/api/weather`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zip, country })
      });
      if (res.ok === false) { throw new Error(`${res.status}: ${res.statusText}`); }

      // Make sure the retrieved data is OK.
      const data = await res.json() as WeatherResponse;
      if (data.error) { throw new Error(data.error); }

      // Get the location ID of the fetched weather data. Check to see if that ID is
      // in our local storage.
      const locationId = data.weather.city.id;
      const locationIndex = locationIds.findIndex(id => locationId === id);
      if (locationIndex !== -1) {
        // If that location ID is present, then update the weather data entry at that
        // index.
        const sliced = weatherData.slice();
        sliced[locationIndex].data = data.weather;
        setWeatherData(sliced);

        // Update the index of the currently shown weather data.
        setCurrentIndex(locationIndex);
      } else {
        // Insert the location ID into local storage.
        setLocationIds([ ...locationIds, locationId ]);

        // Insert the weather data now.
        setWeatherData([ ...weatherData, {
          locationId, data: data.weather
        }]);

        // Update the index of the currently shown weather data.
        setCurrentIndex(weatherData.length - 1);
      }

      setLoading(false);
    } catch (err) {
      console.error(err.message || err);
      setError("Something went wrong. Try again later.");
      setLoading(false);
    }
  }

  const addCity = async (city: string, state: string, country: CountryCode = "US") => {
    // Reset state.
    setError(''); setLoading(true);

    try {
      // Fetch weather data for this location.
      const res = await fetch(`/api/weather`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city, state, country })
      });
      if (res.ok === false) { throw new Error(`${res.status}: ${res.statusText}`); }

      // Make sure the retrieved data is OK.
      const data = await res.json() as WeatherResponse;
      if (data.error) { throw new Error(data.error); }

      // Get the location ID of the fetched weather data. Check to see if that ID is
      // in our local storage.
      const locationId = data.weather.city.id;
      const locationIndex = locationIds.findIndex(id => locationId === id);
      if (locationIndex !== -1) {
        // If that location ID is present, then update the weather data entry at that
        // index.
        const sliced = weatherData.slice();
        sliced[locationIndex].data = data.weather;
        setWeatherData(sliced);

        // Update the index of the currently shown weather data.
        setCurrentIndex(locationIndex);
      } else {
        // Insert the location ID into local storage.
        setLocationIds([ ...locationIds, locationId ]);

        // Insert the weather data now.
        setWeatherData([ ...weatherData, {
          locationId, data: data.weather
        }]);

        // Update the index of the currently shown weather data.
        setCurrentIndex(weatherData.length - 1);
      }

      setLoading(false);
    } catch (err) {
      console.error(err.message || err);
      setError("Something went wrong. Try again later.");
      setLoading(false);
    }
  }

  return (
    <WeatherContext.Provider value={{
      loading,
      error,
      weatherData,
      updateLocationWeather,
      addCoordinate,
      addZipCode,
      addCity
    }}>
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeatherContext = () => useContext(WeatherContext);
export default WeatherProvider;
