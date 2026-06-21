import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], display: "swap" });

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
      <body className={inter.className}>
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
