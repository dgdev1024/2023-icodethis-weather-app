/**
 * @file api / location / zip.ts
 */

import { NextApiRequest, NextApiResponse } from "next";
import { 
  ResolveZipReturn, 
  resolveZip 
} from "../../../lib/location";

export type LocationZipGetQuery = {
  zip: string;
  country: string;
};

const Handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResolveZipReturn>
) => {
  const query = req.query as LocationZipGetQuery;
  const resolved = await resolveZip(
    parseInt(query.zip), query.country || 'US'
  );

  if (resolved.error) { 
    return res.status(resolved.status).json({ error: resolved.error }); 
  }
  
  return res.status(200).json({ location: resolved.location });
};

export default Handler;
