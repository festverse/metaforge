"use client";

import React, { useState, useMemo } from "react";
import type { MetaData } from "./GeneratorForm";

interface CodeOutputProps {
  data: MetaData;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export default function CodeOutput({ data }: CodeOutputProps) {
  const [copied, setCopied] = useState(false);

  const rawCode = useMemo(() => {
    const lines: string[] = [];

    if (data.title) {
      lines.push(`<title>${data.title}</title>`);
    }
    if (data.description) {
      lines.push(
        `<meta name="description" content="${data.description}" />`
      );
    }
    if (data.canonicalUrl) {
      lines.push(`<link rel="canonical" href="${data.canonicalUrl}" />`);
    }

    // Open Graph
    lines.push("");
    lines.push("<!-- Open Graph / Facebook -->");
    lines.push(`<meta property="og:type" content="website" />`);
    if (data.title) {
      lines.push(`<meta property="og:title" content="${data.title}" />`);
    }
    if (data.description) {
      lines.push(
        `<meta property="og:description" content="${data.description}" />`
      );
    }
    if (data.canonicalUrl) {
      lines.push(`<meta property="og:url" content="${data.canonicalUrl}" />`);
    }
    if (data.ogImageUrl) {
      lines.push(`<meta property="og:image" content="${data.ogImageUrl}" />`);
    }
    if (data.siteName) {
      lines.push(
        `<meta property="og:site_name" content="${data.siteName}" />`
      );
    }

    // Twitter
    lines.push("");
    lines.push("<!-- Twitter -->");
    lines.push(`<meta name="twitter:card" content="summary_large_image" />`);
    if (data.title) {
      lines.push(`<meta name="twitter:title" content="${data.title}" />`);
    }
    if (data.description) {
      lines.push(
        `<meta name="twitter:description" content="${data.description}" />`
      );
    }
    if (data.ogImageUrl) {
      lines.push(`<meta name="twitter:image" content="${data.ogImageUrl}" />`);
    }
    if (data.twitterHandle) {
      lines.push(
        `<meta name="twitter:site" content="@${data.twitterHandle}" />`
      );
    }

    return lines.join("\n");
  }, [data]);

  const highlightedHtml = useMemo(() => {
    return rawCode
      .split("\n")
      .map((line) => {
        if (line.startsWith("<!--")) {
          return `<span class="value">${escapeHtml(line)}</span>`;
        }
        return escapeHtml(line)
          .replace(
            /&lt;(\/?[\w-]+)/g,
            '&lt;<span class="tag">$1</span>'
          )
          .replace(
            /(\w[\w-]*)=&quot;/g,
            '<span class="attr">$1</span>=&quot;'
          )
          .replace(
            /=&quot;([^&]*)&quot;/g,
            '=&quot;<span class="value">$1</span>&quot;'
          );
      })
      .join("\n");
  }, [rawCode]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rawCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = rawCode;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const hasContent =
    data.title || data.description || data.canonicalUrl || data.ogImageUrl;

  return (
    <div className="glass-card animate-in" style={{ animationDelay: "0.1s" }}>
      <div className="glass-card-title">
        <span className="icon">📋</span>
        Generated Code
      </div>

      <div className="code-output-wrapper">
        <button
          className={`copy-button ${copied ? "copied" : ""}`}
          onClick={handleCopy}
          disabled={!hasContent}
        >
          {copied ? "✓ Copied" : "Copy"}
        </button>
        <pre className="code-block">
          {hasContent ? (
            <code dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
          ) : (
            <code style={{ color: "var(--text-muted)" }}>
              {"<!-- Start typing above to generate meta tags -->\n"}
            </code>
          )}
        </pre>
      </div>
    </div>
  );
}
