/**
 * @file api / location / coordinates.ts
 */

import { NextApiRequest, NextApiResponse } from "next";
import { 
  ResolveCoordinateReturn, 
  resolveCoordinate 
} from "../../../lib/location";

export type LocationCoordinateGetQuery = {
  lat: string;
  lon: string;
};

const Handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResolveCoordinateReturn>
) => {
  const query = req.query as LocationCoordinateGetQuery;
  const resolved = await resolveCoordinate(
    parseFloat(query.lat), parseFloat(query.lon)
  );

  if (resolved.error) { 
    return res.status(resolved.status).json({ error: resolved.error }); 
  }
  
  return res.status(200).json({ locations: resolved.locations });
};

export default Handler;
