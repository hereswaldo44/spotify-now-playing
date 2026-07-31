export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const basic = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString('base64');

  const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: process.env.SPOTIFY_REFRESH_TOKEN,
    }),
  });

  const tokenData = await tokenRes.json();

  return res.json({
    tokenStatus: tokenRes.status,
    hasAccessToken: !!tokenData.access_token,
    tokenError: tokenData.error ?? null,
    tokenErrorDesc: tokenData.error_description ?? null,
    clientIdPresent: !!process.env.SPOTIFY_CLIENT_ID,
    secretPresent: !!process.env.SPOTIFY_CLIENT_SECRET,
    refreshTokenPresent: !!process.env.SPOTIFY_REFRESH_TOKEN,
  });
}
