export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const response = await fetch(
    'https://www.goodreads.com/review/list_rss/127615610?shelf=currently-reading',
    { headers: { 'User-Agent': 'Mozilla/5.0' } }
  );

  const xml = await response.text();

  return res.json({
    status: response.status,
    bodyPreview: xml.slice(0, 500),
  });
}
