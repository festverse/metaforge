"use client";

import React, { useState } from "react";
import type { MetaData } from "./GeneratorForm";

interface AuditResult {
  success: boolean;
  meta?: {
    title?: string;
    description?: string;
    canonicalUrl?: string;
    siteName?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogUrl?: string;
    ogImage?: string;
    ogSiteName?: string;
    twitterCard?: string;
    twitterTitle?: string;
    twitterDescription?: string;
    twitterImage?: string;
    twitterSite?: string;
  };
  issues?: string[];
  error?: string;
}

interface AuditPanelProps {
  onFixIt: (data: MetaData) => void;
}

export default function AuditPanel({ onFixIt }: AuditPanelProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);

  const handleAudit = async () => {
    if (!url.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data: AuditResult = await res.json();
      setResult(data);
    } catch {
      setResult({
        success: false,
        error: "Network error — couldn't reach the audit service. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFixIt = () => {
    if (!result?.meta) return;
    const m = result.meta;

    onFixIt({
      title: m.ogTitle || m.twitterTitle || m.title || "",
      description: m.ogDescription || m.twitterDescription || m.description || "",
      canonicalUrl: m.ogUrl || m.canonicalUrl || "",
      siteName: m.ogSiteName || m.siteName || "",
      ogImageUrl: m.ogImage || m.twitterImage || "",
      twitterHandle: m.twitterSite ? m.twitterSite.replace(/^@/, "") : "",
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      handleAudit();
    }
  };

  const metaRows = result?.meta
    ? [
        { label: "Title", value: result.meta.title },
        { label: "Description", value: result.meta.description },
        { label: "Canonical URL", value: result.meta.canonicalUrl },
        { label: "og:title", value: result.meta.ogTitle },
        { label: "og:description", value: result.meta.ogDescription },
        { label: "og:image", value: result.meta.ogImage },
        { label: "og:url", value: result.meta.ogUrl },
        { label: "og:site_name", value: result.meta.ogSiteName },
        { label: "twitter:card", value: result.meta.twitterCard },
        { label: "twitter:title", value: result.meta.twitterTitle },
        { label: "twitter:description", value: result.meta.twitterDescription },
        { label: "twitter:image", value: result.meta.twitterImage },
        { label: "twitter:site", value: result.meta.twitterSite },
      ]
    : [];

  return (
    <div className="glass-card animate-in">
      <div className="glass-card-title">
        <span className="icon">🔍</span>
        Audit a Live URL
      </div>

      <div className="audit-input-row">
        <input
          id="audit-url"
          type="url"
          className="form-input"
          placeholder="https://example.com"
          aria-label="URL to audit"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <button
          className="audit-button"
          onClick={handleAudit}
          disabled={loading || !url.trim()}
        >
          {loading && <span className="spinner" />}
          {loading ? "Auditing…" : "Audit"}
        </button>
      </div>

      {/* Error State */}
      {result && !result.success && (
        <div className="audit-error animate-in">
          <span className="error-icon">⚠️</span>
          <span>{result.error}</span>
        </div>
      )}

      {/* Success State */}
      {result?.success && result.meta && (
        <div className="audit-results animate-in">
          {/* Extracted Meta Table */}
          <div className="glass-card" style={{ padding: "var(--space-md)" }}>
            <div className="glass-card-title">
              <span className="icon">📊</span>
              Extracted Meta Tags
            </div>
            <table className="audit-meta-table">
              <tbody>
                {metaRows.map((row) => (
                  <tr key={row.label}>
                    <th>{row.label}</th>
                    <td className={row.value ? "" : "empty"}>
                      {row.value || "Not found"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Issues */}
          {result.issues && result.issues.length > 0 && (
            <div className="glass-card" style={{ padding: "var(--space-md)" }}>
              <div className="glass-card-title">
                <span className="icon">⚠️</span>
                Issues Found ({result.issues.length})
              </div>
              <ul className="issues-list">
                {result.issues.map((issue, i) => {
                  const isWarning =
                    issue.includes("over") || issue.includes("currently");
                  return (
                    <li
                      key={i}
                      className={`issue-item ${isWarning ? "warning" : ""}`}
                    >
                      <span className="issue-icon">
                        {isWarning ? "⚠️" : "❌"}
                      </span>
                      <span>{issue}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {result.issues && result.issues.length === 0 && (
            <div
              className="glass-card"
              style={{
                padding: "var(--space-md)",
                borderLeft: "3px solid var(--status-green)",
              }}
            >
              <div className="glass-card-title" style={{ color: "var(--status-green)" }}>
                <span className="icon">✅</span>
                No Issues Found
              </div>
              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                This page has all the essential meta tags in place. Nice work!
              </p>
            </div>
          )}

          {/* Fix It Button */}
          <button className="fix-button" onClick={handleFixIt}>
            🔧 Fix it — copy to Generator
          </button>
        </div>
      )}
    </div>
  );
}
