/**
 * @file lib / weather.ts
 */

const key = process.env.OPENWEATHERMAP_API_KEY;
const endpoint = `https://api.openweathermap.org/data/2.5`;
const weatherEndpoint = `${endpoint}/weather?appid=${key}`;
const forecastEndpoint = `${endpoint}/forecast?appid=${key}`;

export type MeasureUnits = "standard" | "metric" | "imperial";

export type TemperatureUnit = "K" | "°C" | "°F";

export type WindUnit = "m/sec" | "mi/hr";

export type WeatherCondition = {
  id: number;
  name: string;
  description: string;
  icon: string;
  chanceOfPrecip?: number;
};

export type Temperature = {
  unit: string;
  air: number;
  feelsLike: number;
  minimum: number;
  maximum: number;
  humidity: number;
  pressure: number;
};

export type Wind = {
  unit: string;
  speed: number;
  gust: number;
  directionDegrees: number;
  direction: string;
};

export type Misc = {
  visibility: number;
  cloudCover: number;
  time: Date;
};

export type Weather = {
  condition: WeatherCondition;
  temperature: Temperature;
  wind: Wind;
  misc: Misc;
};

export type ResolvedCurrentWeather = {
  weather?: Weather;
  error?: string;
  status?: number;
};

export type ResolvedExtendedForecast = {
  weather?: Weather[];
  error?: string;
  status?: number;
};

const getTemperatureUnit = (units: MeasureUnits): TemperatureUnit => {
  switch (units) {
    case "standard":
      return "K";
    case "metric":
      return "°C";
    case "imperial":
      return "°F";
  }
};

const getWindUnit = (units: MeasureUnits): WindUnit => {
  return units === "imperial" ? "mi/hr" : "m/sec";
};

const toCardinalDirection = (degrees: number) => {
  degrees = degrees % 360;

  if (degrees > 348.75 || degrees <= 11.25) {
    return "N";
  } else if (degrees > 11.25 && degrees <= 33.75) {
    return "NNE";
  } else if (degrees > 33.75 && degrees <= 56.25) {
    return "NE";
  } else if (degrees > 56.25 && degrees <= 78.75) {
    return "ENE";
  } else if (degrees > 78.75 && degrees <= 101.25) {
    return "E";
  } else if (degrees > 101.25 && degrees <= 123.75) {
    return "ESE";
  } else if (degrees > 123.75 && degrees <= 146.25) {
    return "SE";
  } else if (degrees > 146.25 && degrees <= 168.75) {
    return "SSE";
  } else if (degrees > 168.75 && degrees <= 191.25) {
    return "S";
  } else if (degrees > 191.25 && degrees <= 213.75) {
    return "SSW";
  } else if (degrees > 213.75 && degrees <= 236.25) {
    return "SW";
  } else if (degrees > 236.25 && degrees <= 258.75) {
    return "WSW";
  } else if (degrees > 258.75 && degrees <= 281.25) {
    return "W";
  } else if (degrees > 281.25 && degrees <= 303.75) {
    return "WNW";
  } else if (degrees > 303.75 && degrees <= 325.25) {
    return "NW";
  } else if (degrees > 325.25 && degrees <= 348.75) {
    return "NNW";
  }
};

export const fetchCurrentWeather = async (
  lat: number,
  lon: number,
  units: MeasureUnits
): Promise<ResolvedCurrentWeather> => {
  const query: string = `${weatherEndpoint}&lat=${lat}&lon=${lon}&units=${units}`;
  const res = await fetch(query);
  if (res.ok === false) {
    return {
      status: res.status,
      error: `${res.status}: ${res.statusText}`,
    };
  }

  const data = await res.json();
  console.log(data);

  return {
    weather: {
      condition: {
        id: data.weather[0].id,
        name: data.weather[0].main,
        description: data.weather[0].description,
        icon: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
        // icon: data.weather.icon,
      },
      temperature: {
        unit: getTemperatureUnit(units),
        air: data.main.temp,
        feelsLike: data.main.feels_like,
        minimum: data.main.temp_min,
        maximum: data.main.temp_max,
        pressure: data.main.pressure,
        humidity: data.main.humidity,
      },
      wind: {
        unit: getWindUnit(units),
        speed: data.wind.speed,
        gust: data.wind.gust,
        directionDegrees: data.wind.deg,
        direction: toCardinalDirection(data.wind.deg),
      },
      misc: {
        visibility: data.visibility,
        cloudCover: data.clouds.all,
        time: new Date(data.dt),
      },
    },
  };
};

export const fetchExtendedForecast = async (
  lat: number,
  lon: number,
  units: MeasureUnits
): Promise<ResolvedExtendedForecast> => {
  const query: string = `${forecastEndpoint}&lat=${lat}&lon=${lon}&units=${units}`;
  const res = await fetch(query);
  if (res.ok === false) {
    return {
      status: res.status,
      error: `${res.status}: ${res.statusText}`,
    };
  }

  const data = await res.json();

  const mappedForecast: Weather[] = data.list.map((data) => ({
    condition: {
      id: data.weather.id,
      name: data.weather.main,
      description: data.weather.description,
      icon: `https://openweathermap.org/img/wn/${data.weather.icon}@2x`,
      chanceOfPrecip: data.pop,
    },
    temperature: {
      unit: getTemperatureUnit(units),
      air: data.main.temp,
      feelsLike: data.main.feels_like,
      minimum: data.main.temp_min,
      maximum: data.main.temp_max,
      pressure: data.main.pressure,
      humidity: data.main.humidity,
    },
    wind: {
      unit: getWindUnit(units),
      speed: data.wind.speed,
      gust: data.wind.gust,
      directionDegrees: data.wind.deg,
      direction: toCardinalDirection(data.wind.deg),
    },
    misc: {
      visibility: data.visibility,
      cloudCover: data.clouds.all,
      time: new Date(data.dt),
    },
  }));

  return { weather: mappedForecast };
};
