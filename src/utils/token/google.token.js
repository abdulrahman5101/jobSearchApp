import { OAuth2Client } from "google-auth-library";

export const verifyGoogleToken = async (idToken) => {
  const client = new OAuth2Client();
  const tiket = await client.verifyIdToken({
    idToken,
    audience: process.env.CLIENT_ID,
  });
  const payload = tiket.getPayload();
  return payload;
};