import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "MetaForge — Meta Tag Generator & Auditor",
  description:
    "Generate perfect meta tags for SEO and social sharing. Audit any live URL to find missing or broken meta tags, then fix them instantly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <div className="app-wrapper">
          <header className="app-header">
            <h1 className="app-logo">⚡ MetaForge</h1>
            <p className="app-tagline">
              Generate &amp; audit meta tags for perfect SEO &amp; social previews
            </p>
          </header>
          <main className="main-content">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
