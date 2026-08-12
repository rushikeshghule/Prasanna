import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import type { ReactNode } from "react";
import "./globals.css";

const TITLE = "Prasanna Trends — Clothing & Jewellery Design App";
const DESCRIPTION =
  "Browse 60+ saree, blouse, lehenga and gold jewellery designs. Save favourites, download HD files and share with your tailor. Interactive preview of the Prasanna Trends mobile app.";

/**
 * Builds absolute URLs from the incoming request so link previews (WhatsApp,
 * Telegram, iMessage, Slack) work on any host — sandbox preview, Vercel or a
 * custom domain — with no configuration.
 */
async function resolveBaseUrl(): Promise<string> {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) return configured.replace(/\/$/, "");

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto =
    h.get("x-forwarded-proto") ?? (host.startsWith("localhost") || host.startsWith("127.") ? "http" : "https");
  return `${proto}://${host}`;
}

export async function generateMetadata(): Promise<Metadata> {
  const base = await resolveBaseUrl();

  return {
    metadataBase: new URL(base),
    title: TITLE,
    description: DESCRIPTION,
    applicationName: "Prasanna Trends",
    keywords: [
      "saree designs",
      "blouse designs",
      "bridal lehenga",
      "gold jewellery designs",
      "necklace designs",
      "Prasanna Trends",
    ],
    icons: {
      icon: [
        { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
        { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    },
    manifest: "/manifest.webmanifest",
    openGraph: {
      type: "website",
      siteName: "Prasanna Trends",
      title: TITLE,
      description: DESCRIPTION,
      url: base,
      locale: "en_IN",
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: "Prasanna Trends — clothing and jewellery design library",
          type: "image/jpeg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: TITLE,
      description: DESCRIPTION,
      images: ["/og-image.jpg"],
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#09060d",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Prasanna Trends" />
      </head>
      <body className="bg-ink text-cream antialiased">{children}</body>
    </html>
  );
}
