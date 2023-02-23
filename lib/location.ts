/**
 * @file lib / location.ts
 */

const key = process.env.OPENWEATHERMAP_API_KEY;
const endpoint = `https://api.openweathermap.org/geo/1.0`;
const directEndpoint = `${endpoint}/direct?appid=${key}`;
const zipEndpoint = `${endpoint}/zip?appid=${key}`;
const reverseEndpoint = `${endpoint}/reverse?appid=${key}`;

export type Coordinate = {
  lat: number;
  lon: number
};

export type ResolvedLocation = {
  name: string;
  state?: string;
  country: string;
  coord: Coordinate;
};

export type ResolveCoordinateReturn = {
  error?: string;
  status?: number;
  locations?: ResolvedLocation[];
};

export type ResolveZipReturn = {
  error?: string;
  status?: number;
  location?: ResolvedLocation;
}

export const resolveCity = async (
  cityName: string,
  countryCode: string,
  stateCode?: string
) : Promise<ResolveCoordinateReturn> => {
  let query : string;
  if (stateCode && stateCode !== '') {
    query = `${directEndpoint}&q=${cityName},${stateCode},${countryCode}`;
  } else {
    query = `${directEndpoint}&q=${cityName},${countryCode}`;
  }

  // Hit the endpoint and fetch the data.
  const res = await fetch(query);
  if (res.ok === false) { 
    return { 
      status: res.status, 
      error: `${res.status}: ${res.statusText}` 
    };
  }

  // Get the data, format it and return it.
  const data = await res.json();

  return {
    locations: data.map((location) => ({
      name: location.name,
      state: location.state || '',
      country: location.country,
      coord: {
        lat: location.lat,
        lon: location.lon
      }
    }))
  };
}

export const resolveZip = async (
  zip: number,
  countryCode: string
) : Promise<ResolveZipReturn> => {
  const res = await fetch(`${zipEndpoint}&zip=${zip},${countryCode}`);
  if (res.ok === false) { 
    return { 
      status: res.status, 
      error: `${res.status}: ${res.statusText}` 
    };
  }

  // Get the data, format it and return it.
  const data = await res.json();

  return {
    location: {
      name: data.name,
      state: data.state || '',
      country: data.country,
      coord: {
        lat: data.lat,
        lon: data.lon
      }
    }
  }
};

export const resolveCoordinate = async (
  lat: number,
  lon: number
) : Promise<ResolveCoordinateReturn> => {
  // Hit the endpoint and fetch the data.
  const res = await fetch(`${reverseEndpoint}&lat=${lat}&lon=${lon}`);
  if (res.ok === false) { 
    return { 
      status: res.status, 
      error: `${res.status}: ${res.statusText}` 
    };
  }

  // Get the data, format it and return it.
  const data = await res.json();

  return {
    locations: data.map((location) => ({
      name: location.name,
      state: location.state || '',
      country: location.country,
      coord: {
        lat: location.lat,
        lon: location.lon
      }
    }))
  };
};
