import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Prasanna Trends — Design Library",
    short_name: "Prasanna Trends",
    description:
      "Discover, save, download and share clothing and jewellery designs. Interactive preview of the Prasanna Trends mobile app.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#09060d",
    theme_color: "#09060d",
    categories: ["shopping", "lifestyle", "photo"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
