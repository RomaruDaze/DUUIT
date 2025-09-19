// Create src/app/manifest/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const manifest = {
    name: "DUIT - Just Do It",
    short_name: "DUIT",
    description: "Just Do It - Stay organized and productive",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/icon-192x192.ico",
        sizes: "192x192",
        type: "image/x-icon"
      },
      {
        src: "/icon-512x512.ico",
        sizes: "512x512",
        type: "image/x-icon"
      }
    ]
  };

  return new NextResponse(JSON.stringify(manifest), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}