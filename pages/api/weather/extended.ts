/**
 * @file pages / api / weather / current.ts
 */

import { NextApiRequest, NextApiResponse } from "next";
import {
  fetchExtendedForecast,
  MeasureUnits,
  ResolvedExtendedForecast,
} from "../../../lib/weather";

export type ExtendedForecastGetQuery = {
  lat: string;
  lon: string;
  units?: MeasureUnits;
};

const Handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResolvedExtendedForecast>
) => {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "This method is not allowed." });
  }

  const query = req.query as ExtendedForecastGetQuery;
  const resolved = await fetchExtendedForecast(
    parseFloat(query.lat),
    parseFloat(query.lon),
    query.units || "standard"
  );

  if (resolved.error) {
    return res.status(resolved.status).json({ error: resolved.error });
  }

  return res.status(200).json({ weather: resolved.weather });
};

export default Handler;
