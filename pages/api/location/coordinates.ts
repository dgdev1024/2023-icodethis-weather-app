/**
 * @file api / location / coordinates.ts
 */

import { NextApiRequest, NextApiResponse } from "next";
import { 
  ResolveCoordinateReturn, 
  resolveCoordinate 
} from "../../../lib/location";

export type LocationCoordinatePostBody = {
  lat: number;
  lon: number;
};

const Handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResolveCoordinateReturn>
) => {
  if (req.method != 'POST') {
    return res.status(405).json({ error: "This method is not allowed." });
  }

  const body = req.body as LocationCoordinatePostBody;
  const resolved = await resolveCoordinate(
    body.lat, body.lon
  );

  if (resolved.error) { 
    return res.status(resolved.status).json({ error: resolved.error }); 
  }
  
  return res.status(200).json({ locations: resolved.locations });
};

export default Handler;
