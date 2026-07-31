import type { Metadata } from "next";
import "./globals.css";

const publicBase = "https://sophiatey-dev.github.io/cst-ai-initiative";

export const metadata: Metadata = {
  metadataBase: new URL(publicBase),
  title: "CST AI Initiative — From AI Hype to AI Habit",
  description: "Malaysia's practical AI readiness movement, powered by the Kaku continuous learning community.",
  icons: { icon: `${publicBase}/favicon.svg`, shortcut: `${publicBase}/favicon.svg` },
  openGraph: {
    title: "From AI Hype to AI Habit",
    description: "CST AI Initiative · Malaysia",
    images: [{ url: `${publicBase}/assets/social/og.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "From AI Hype to AI Habit",
    description: "CST AI Initiative · Malaysia",
    images: [`${publicBase}/assets/social/og.png`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
