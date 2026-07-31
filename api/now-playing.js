export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const token = await getAccessToken();
  const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.status === 204 || response.status > 400) {
    return res.json({ isPlaying: false });
  }

  const song = await response.json();

  if (!song?.item) {
    return res.json({ isPlaying: false });
  }

  return res.json({
    isPlaying: song.is_playing,
    title: song.item.name,
    artist: song.item.artists.map(a => a.name).join(', '),
    albumArt: song.item.album.images[0]?.url,
    songUrl: song.item.external_urls.spotify,
  });
}

async function getAccessToken() {
  const basic = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString('base64');

  const response = await fetch('https://accounts.spotify.com/api/token', {
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

  const data = await response.json();
  return data.access_token;
}
