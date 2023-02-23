/**
 * @file api / location / coordinates.ts
 */

import { NextApiRequest, NextApiResponse } from "next";
import { 
  ResolveCoordinateReturn, 
  resolveCity 
} from "../../../lib/location";

export type LocationCityGetQuery = {
  city: string;
  state?: string;
  country: string;
};

const Handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResolveCoordinateReturn>
) => {
  const query = req.query as LocationCityGetQuery;
  const resolved = await resolveCity(
    query.city, query.country, query?.state || undefined
  );

  if (resolved.error) { 
    return res.status(resolved.status).json({ error: resolved.error }); 
  }
  
  return res.status(200).json({ locations: resolved.locations });
};

export default Handler;
