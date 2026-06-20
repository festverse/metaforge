"use client";

import React, { useState } from "react";
import GeneratorForm, { type MetaData } from "@/components/GeneratorForm";
import PreviewCards from "@/components/PreviewCards";
import CodeOutput from "@/components/CodeOutput";
import AuditPanel from "@/components/AuditPanel";

const defaultMeta: MetaData = {
  title: "",
  description: "",
  canonicalUrl: "",
  siteName: "",
  ogImageUrl: "",
  twitterHandle: "",
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<"generate" | "audit">("generate");
  const [metaData, setMetaData] = useState<MetaData>(defaultMeta);

  const handleFixIt = (data: MetaData) => {
    setMetaData(data);
    setActiveTab("generate");
  };

  return (
    <>
      {/* Tab Bar */}
      <div className="tab-bar">
        <button
          className={`tab-button ${activeTab === "generate" ? "active" : ""}`}
          onClick={() => setActiveTab("generate")}
        >
          ✏️ Generate
        </button>
        <button
          className={`tab-button ${activeTab === "audit" ? "active" : ""}`}
          onClick={() => setActiveTab("audit")}
        >
          🔍 Audit a URL
        </button>
      </div>

      {/* Generate Mode */}
      {activeTab === "generate" && (
        <div className="content-grid">
          <div>
            <GeneratorForm data={metaData} onChange={setMetaData} />
            <div style={{ marginTop: "var(--space-lg)" }}>
              <CodeOutput data={metaData} />
            </div>
          </div>
          <PreviewCards data={metaData} />
        </div>
      )}

      {/* Audit Mode */}
      {activeTab === "audit" && <AuditPanel onFixIt={handleFixIt} />}
    </>
  );
}
