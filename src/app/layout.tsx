import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "The Artisan Kiln | Ceramic Tile Order Form",
  description: "Interactive ceramic tile order form with cart, checkout and design tool."
};

// RootLayout задаёт общий HTML-каркас Next.js для всего приложения.
export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      {/* body содержит всё клиентское приложение и фон в стиле бумажного макета. */}
      <body>{children}</body>
    </html>
  );
}
