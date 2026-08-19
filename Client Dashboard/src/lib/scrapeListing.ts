export type ListingMeta = {
  imageUrl: string | null;
  address: string | null;
  city: string | null;
  price: number | null;
};

function matchMeta(html: string, patterns: RegExp[]): string | null {
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return decodeHtmlEntities(match[1]);
  }
  return null;
}

function decodeHtmlEntities(text: string) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

const IMAGE_PATTERNS = [
  /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
  /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
  /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
  /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i,
];

const TITLE_PATTERNS = [
  /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i,
  /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i,
  /<title[^>]*>([^<]+)<\/title>/i,
];

const DESCRIPTION_PATTERNS = [
  /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i,
  /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:description["']/i,
];

const PRICE_PATTERN = /\$\s?[\d,]{4,}/;

// Matches a street address embedded anywhere in a sentence, e.g. "...house
// located at 2290 Cedar Ct, Puyallup, WA 98371 for $489,000" -> the listing
// sites format their og:title/description very differently from each other,
// so this looks for the "number + street words, City, ST ZIP" shape rather
// than assuming the address leads the string. The lookahead keeps a second
// embedded number (a price, sqft figure, bed/bath count) from being read as
// part of the street name.
const ADDRESS_PATTERN =
  /\d{1,6}\s+[\w.'-]+(?:\s+(?!\d+\b)[\w.'-]+){0,3},\s*[A-Za-z .'-]+,\s*[A-Z]{2}\s*\d{5}/;

function extractPrice(text: string) {
  const match = text.match(PRICE_PATTERN);
  if (!match) return { price: null, rest: text };
  const digits = match[0].replace(/[^\d]/g, "");
  const value = Number(digits);
  return { price: Number.isFinite(value) && value > 0 ? value : null, rest: text.replace(match[0], " ") };
}

function extractLocation(text: string) {
  const match = text.match(ADDRESS_PATTERN);
  if (!match) return { address: null, city: null };
  const parts = match[0].split(",").map((p) => p.trim());
  return { address: parts[0], city: parts.slice(1).join(", ") };
}

export async function fetchListingMeta(url: string): Promise<ListingMeta> {
  const empty: ListingMeta = { imageUrl: null, address: null, city: null, price: null };

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return empty;
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return empty;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch(parsed.toString(), {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
    });
    if (!res.ok) return empty;

    const html = await res.text();
    const imageUrl = matchMeta(html, IMAGE_PATTERNS);
    const title = matchMeta(html, TITLE_PATTERNS) ?? "";
    const description = matchMeta(html, DESCRIPTION_PATTERNS) ?? "";

    const titlePrice = extractPrice(title);
    const descriptionPrice = extractPrice(description);
    const price = titlePrice.price ?? descriptionPrice.price;

    const location = extractLocation(titlePrice.rest);
    const fallbackLocation = location.address ? null : extractLocation(descriptionPrice.rest);

    return {
      imageUrl,
      address: location.address ?? fallbackLocation?.address ?? null,
      city: location.city ?? fallbackLocation?.city ?? null,
      price,
    };
  } catch {
    return empty;
  } finally {
    clearTimeout(timeout);
  }
}
