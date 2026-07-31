export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const response = await fetch(
    'https://www.goodreads.com/review/list_rss/127615610?shelf=currently-reading',
    { headers: { 'User-Agent': 'Mozilla/5.0' } }
  );

  const xml = await response.text();

  const itemMatch = xml.match(/<item>([\s\S]*?)<\/item>/);
  if (!itemMatch) return res.json({ isReading: false });

  const item = itemMatch[1];

  const title = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1]
    ?? item.match(/<title>(.*?)<\/title>/)?.[1];

  const author = item.match(/<author_name><!\[CDATA\[(.*?)\]\]><\/author_name>/)?.[1]
    ?? item.match(/<author_name>(.*?)<\/author_name>/)?.[1];

  const cover = item.match(/<book_large_image_url><!\[CDATA\[(.*?)\]\]><\/book_large_image_url>/)?.[1]
    ?? item.match(/<book_large_image_url>(.*?)<\/book_large_image_url>/)?.[1];

  const link = item.match(/<link>(.*?)<\/link>/)?.[1];

  if (!title) return res.json({ isReading: false });

  return res.json({
    isReading: true,
    title,
    author: author?.replace(/&apos;/g, "'").replace(/&amp;/g, '&') ?? null,
    cover: cover ?? null,
    bookUrl: link?.replace(/<!\[CDATA\[/, '').replace(/\]\]>/, '') ?? null,
  });
