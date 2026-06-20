"use client";

import React from "react";
import type { MetaData } from "./GeneratorForm";

interface PreviewCardsProps {
  data: MetaData;
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return "example.com";
  }
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + "…";
}

export default function PreviewCards({ data }: PreviewCardsProps) {
  const domain = extractDomain(data.canonicalUrl);
  const displayTitle = data.title || "Your Page Title";
  const displayDesc = data.description || "Your meta description will appear here…";
  const displaySiteName = data.siteName || domain;

  return (
    <div className="preview-stack">
      {/* Google SERP Preview */}
      <div>
        <div className="preview-label">Google Search Preview</div>
        <div className="serp-preview glass-card" style={{ background: "#fff", border: "1px solid #dfe1e5" }}>
          <div className="serp-breadcrumb">
            <div className="serp-favicon">⚡</div>
            <div className="serp-url-stack">
              <span className="serp-site-name">{displaySiteName}</span>
              <span className="serp-url">
                {data.canonicalUrl || "https://example.com/your-page"}
              </span>
            </div>
          </div>
          <div className="serp-title">{truncate(displayTitle, 60)}</div>
          <div className="serp-description">{truncate(displayDesc, 160)}</div>
        </div>
      </div>

      {/* Twitter/X Card Preview */}
      <div>
        <div className="preview-label">Twitter / X Card Preview</div>
        <div className="social-card">
          <div className="social-card-image">
            {data.ogImageUrl ? (
              <img
                src={data.ogImageUrl}
                alt="OG preview"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                  (e.target as HTMLImageElement).parentElement!.querySelector(".placeholder-icon")!
                    .removeAttribute("style");
                }}
              />
            ) : null}
            <span
              className="placeholder-icon"
              style={data.ogImageUrl ? { display: "none" } : undefined}
            >
              🖼️
            </span>
          </div>
          <div className="social-card-body twitter">
            <div className="social-card-title">{truncate(displayTitle, 70)}</div>
            <div className="social-card-description">
              {truncate(displayDesc, 200)}
            </div>
            <div className="social-card-domain">{domain}</div>
          </div>
        </div>
      </div>

      {/* Facebook / LinkedIn OG Card Preview */}
      <div>
        <div className="preview-label">Facebook / LinkedIn Preview</div>
        <div className="social-card">
          <div className="social-card-image">
            {data.ogImageUrl ? (
              <img
                src={data.ogImageUrl}
                alt="OG preview"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                  (e.target as HTMLImageElement).parentElement!.querySelector(".placeholder-icon")!
                    .removeAttribute("style");
                }}
              />
            ) : null}
            <span
              className="placeholder-icon"
              style={data.ogImageUrl ? { display: "none" } : undefined}
            >
              🖼️
            </span>
          </div>
          <div className="social-card-body facebook">
            <div className="social-card-domain">{domain.toUpperCase()}</div>
            <div className="social-card-title">{truncate(displayTitle, 65)}</div>
            <div className="social-card-description">
              {truncate(displayDesc, 155)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
