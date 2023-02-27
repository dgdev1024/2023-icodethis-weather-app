/**
 * @file api / location / zip.ts
 */

import { NextApiRequest, NextApiResponse } from "next";
import { 
  ResolveZipReturn, 
  resolveZip 
} from "../../../lib/location";

export type LocationZipPostBody = {
  zip: string;
  country: string;
};

const Handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResolveZipReturn>
) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "This method is not allowed." });
  }

  const body = req.body as LocationZipPostBody;
  const resolved = await resolveZip(
    body.zip, body.country || 'US'
  );

  if (resolved.error) { 
    return res.status(resolved.status).json({ error: resolved.error }); 
  }
  
  return res.status(200).json({ location: resolved.location });
};

export default Handler;
