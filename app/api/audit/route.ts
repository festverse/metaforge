import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

const BROWSER_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const TIMEOUT_MS = 8000;

export async function POST(request: NextRequest) {
  let body: { url?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  const { url } = body;

  // Validate URL
  if (!url || typeof url !== "string") {
    return NextResponse.json(
      {
        success: false,
        error: "Please provide a URL to audit.",
      },
      { status: 400 }
    );
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      throw new Error("Bad protocol");
    }
  } catch {
    return NextResponse.json(
      {
        success: false,
        error:
          "That doesn't look like a valid URL. Please include https:// at the beginning.",
      },
      { status: 400 }
    );
  }

  // Fetch the page
  let html: string;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const response = await fetch(parsedUrl.toString(), {
      headers: {
        "User-Agent": BROWSER_UA,
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      signal: controller.signal,
      redirect: "follow",
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: `The server responded with HTTP ${response.status}. The page may not exist or is restricting access.`,
        },
        { status: 200 }
      );
    }

    html = await response.text();
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "AbortError") {
      return NextResponse.json(
        {
          success: false,
          error:
            "The site took too long to respond (>8s). It may be down or blocking automated requests.",
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error:
          "Couldn't reach that URL. Please check it's correct and publicly accessible.",
      },
      { status: 200 }
    );
  }

  // Parse HTML
  const $ = cheerio.load(html);

  if ($("head").length === 0) {
    return NextResponse.json(
      {
        success: false,
        error:
          "The page returned HTML but no <head> section was found.",
      },
      { status: 200 }
    );
  }

  // Extract meta data
  const getMeta = (attr: string, value: string): string | undefined => {
    const el =
      $(`meta[property="${value}"]`).attr("content") ||
      $(`meta[name="${value}"]`).attr("content");
    return el || undefined;
  };

  const title = $("title").first().text().trim() || undefined;
  const description =
    $('meta[name="description"]').attr("content")?.trim() || undefined;
  const canonicalUrl =
    $('link[rel="canonical"]').attr("href")?.trim() || undefined;

  const meta = {
    title,
    description,
    canonicalUrl,
    siteName: getMeta("property", "og:site_name"),
    ogTitle: getMeta("property", "og:title"),
    ogDescription: getMeta("property", "og:description"),
    ogUrl: getMeta("property", "og:url"),
    ogImage: getMeta("property", "og:image"),
    ogSiteName: getMeta("property", "og:site_name"),
    twitterCard:
      getMeta("name", "twitter:card") || getMeta("property", "twitter:card"),
    twitterTitle:
      getMeta("name", "twitter:title") || getMeta("property", "twitter:title"),
    twitterDescription:
      getMeta("name", "twitter:description") ||
      getMeta("property", "twitter:description"),
    twitterImage:
      getMeta("name", "twitter:image") || getMeta("property", "twitter:image"),
    twitterSite:
      getMeta("name", "twitter:site") || getMeta("property", "twitter:site"),
  };

  // Run issue checks
  const issues: string[] = [];

  if (!title) {
    issues.push("No <title> tag found");
  } else if (title.length > 60) {
    issues.push(`Title is over 60 characters (currently ${title.length})`);
  }

  if (!description) {
    issues.push("No meta description found");
  } else if (description.length > 160) {
    issues.push(
      `Description is over 160 characters (currently ${description.length})`
    );
  }

  if (!canonicalUrl) {
    issues.push("No canonical URL specified");
  }

  if (!meta.ogTitle) {
    issues.push("Missing og:title");
  }
  if (!meta.ogDescription) {
    issues.push("Missing og:description");
  }
  if (!meta.ogImage) {
    issues.push("Missing og:image — social shares won't have a preview image");
  }
  if (!meta.ogUrl) {
    issues.push("Missing og:url");
  }

  if (!meta.twitterCard) {
    issues.push("Missing twitter:card");
  }
  if (!meta.twitterTitle) {
    issues.push("Missing twitter:title");
  }
  if (!meta.twitterDescription) {
    issues.push("Missing twitter:description");
  }
  if (!meta.twitterImage) {
    issues.push("Missing twitter:image");
  }

  return NextResponse.json({
    success: true,
    meta,
    issues,
  });
}
