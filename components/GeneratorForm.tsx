"use client";

import React from "react";

export interface MetaData {
  title: string;
  description: string;
  canonicalUrl: string;
  siteName: string;
  ogImageUrl: string;
  twitterHandle: string;
}

interface GeneratorFormProps {
  data: MetaData;
  onChange: (data: MetaData) => void;
}

function charCounterStatus(
  length: number,
  idealMin: number,
  idealMax: number
): "green" | "yellow" | "red" {
  if (length === 0) return "green";
  if (length > idealMax) return "red";
  if (length >= idealMin) return "green";
  if (length >= idealMin - 10) return "yellow";
  return "green";
}

export default function GeneratorForm({ data, onChange }: GeneratorFormProps) {
  const update = (field: keyof MetaData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const handleTwitterHandle = (value: string) => {
    // Auto-prefix @ but don't double up
    const cleaned = value.replace(/^@+/, "");
    update("twitterHandle", cleaned);
  };

  const titleStatus = charCounterStatus(data.title.length, 50, 60);
  const descStatus = charCounterStatus(data.description.length, 150, 160);

  return (
    <div className="glass-card animate-in">
      <div className="glass-card-title">
        <span className="icon">✏️</span>
        Meta Tag Fields
      </div>

      <div className="form-grid">
        {/* Page Title */}
        <div className="form-group">
          <label className="form-label" htmlFor="meta-title">
            Page Title
            <span className={`char-counter ${titleStatus}`}>
              {data.title.length}/60
            </span>
          </label>
          <input
            id="meta-title"
            type="text"
            className="form-input"
            placeholder="Your page title — aim for 50–60 characters"
            value={data.title}
            onChange={(e) => update("title", e.target.value)}
          />
        </div>

        {/* Meta Description */}
        <div className="form-group">
          <label className="form-label" htmlFor="meta-description">
            Meta Description
            <span className={`char-counter ${descStatus}`}>
              {data.description.length}/160
            </span>
          </label>
          <textarea
            id="meta-description"
            className="form-textarea"
            placeholder="A compelling summary of your page — aim for 150–160 characters"
            value={data.description}
            onChange={(e) => update("description", e.target.value)}
            rows={3}
          />
        </div>

        {/* Canonical URL + Site Name */}
        <div className="form-group row-2">
          <div className="form-group">
            <label className="form-label" htmlFor="canonical-url">
              Canonical URL
            </label>
            <input
              id="canonical-url"
              type="url"
              className="form-input"
              placeholder="https://example.com/page"
              value={data.canonicalUrl}
              onChange={(e) => update("canonicalUrl", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="site-name">
              Site Name
            </label>
            <input
              id="site-name"
              type="text"
              className="form-input"
              placeholder="My Website"
              value={data.siteName}
              onChange={(e) => update("siteName", e.target.value)}
            />
          </div>
        </div>

        {/* OG Image URL */}
        <div className="form-group">
          <label className="form-label" htmlFor="og-image-url">
            OG Image URL
            <span className="form-hint">Recommended: 1200×630px</span>
          </label>
          <input
            id="og-image-url"
            type="url"
            className="form-input"
            placeholder="https://example.com/og-image.jpg"
            value={data.ogImageUrl}
            onChange={(e) => update("ogImageUrl", e.target.value)}
          />
        </div>

        {/* Twitter Handle */}
        <div className="form-group">
          <label className="form-label" htmlFor="twitter-handle">
            Twitter Handle
            <span className="optional">Optional</span>
          </label>
          <input
            id="twitter-handle"
            type="text"
            className="form-input"
            placeholder="@yourhandle"
            value={data.twitterHandle ? `@${data.twitterHandle}` : ""}
            onChange={(e) => handleTwitterHandle(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
