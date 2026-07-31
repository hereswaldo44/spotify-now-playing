export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const response = await fetch(
    'https://www.goodreads.com/review/list_rss/127615610?shelf=currently-reading'
  );

  const xml = await response.text();

  const titleMatch = xml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/);
  const authorMatch = xml.match(/<author_name><!\[CDATA\[(.*?)\]\]><\/author_name>/);
  const coverMatch = xml.match(/<book_large_image_url><!\[CDATA\[(.*?)\]\]><\/book_large_image_url>/);
  const linkMatch = xml.match(/<link>(https:\/\/www\.goodreads\.com\/book\/show\/.*?)<\/link>/);

  if (!titleMatch) {
    return res.json({ isReading: false });
  }

  return res.json({
    isReading: true,
    title: titleMatch[1],
    author: authorMatch?.[1] ?? null,
    cover: coverMatch?.[1] ?? null,
    bookUrl: linkMatch?.[1] ?? null,
  });
}
