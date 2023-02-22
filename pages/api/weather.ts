/**
 * @file pages / api / weather.ts
 */

import type { NextApiRequest, NextApiResponse } from "next";
import type { 
  CountryCode, 
  CurrentResponse, 
  ThreeHourResponse 
} from "openweathermap-ts/dist/types";
import OpenWeatherMap from "openweathermap-ts";

// Create the OpenWeatherMap client.
const openWeather = new OpenWeatherMap({ 
  apiKey: process.env.OPENWEATHERMAP_API_KEY 
});

export type WeatherResponse = {
  error?: string;
  weather?: ThreeHourResponse;
}

export type WeatherData = ThreeHourResponse;

export type WeatherGetQuery = {
  id: string;
};

export type WeatherPostBody = {
  latitude?: string;
  longitude?: string;
  zip?: string;
  city?: string;
  state?: string;
  country?: CountryCode;
};

const handleGet = async (
  req: NextApiRequest, 
  res: NextApiResponse<WeatherResponse>
) => {
  const query = req.query as WeatherGetQuery;
  if (query.id) {
    return res.status(400).json({ error: "Please provide a location ID." });
  }

  try {
    const weather: ThreeHourResponse = 
      await openWeather.getThreeHourForecastByCityId(
        parseInt(query.id)
      );

    return res.status(200).json({ weather });
  } catch (err) {
    console.error(err.message || err);
    return res.status(500).json({ error: err.message || err });
  }
}

const handlePost = async (
  req: NextApiRequest, 
  res: NextApiResponse<WeatherResponse>
) => {
  const body = req.body as WeatherPostBody;

  try {
    let weather: ThreeHourResponse = null;
    if (body.latitude && body.longitude) {
      weather = await openWeather.getThreeHourForecastByGeoCoordinates(
        parseInt(body.latitude), parseInt(body.longitude)
      );
    } else if (body.zip) {
      weather = await openWeather.getThreeHourForecastByZipcode(
        parseInt(body.zip), body?.country || 'US'
      );
    } else if (body.city) {
      weather = await openWeather.getThreeHourForecastByCityName({
        cityName: body.city,
        state: body.state || '',
        countryCode: body.country || 'US'
      })
    } else {
      return res.status(400).json({ error: "Insufficient data." });
    }

    return res.status(200).json({ weather });
  } catch (err) {
    console.error(err.message || err);
    return res.status(500).json({ error: err.message || err });
  }
}

const Handler = async (
  req: NextApiRequest, 
  res: NextApiResponse<WeatherResponse>
) => {
  if (req.method == "GET") {
    return await handleGet(req, res);
  } else if (req.method == "POST") {
    return await handlePost(req, res);
  }

  return res.status(405).json({ error: "This method is not allowed." });
};

export default Handler;
