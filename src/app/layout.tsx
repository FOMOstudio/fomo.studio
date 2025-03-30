import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FOMO Studio — build unique and polished ai experiences",
  description:
    "A studio that builds unique and polished AI experiences for the internet.",
  metadataBase: new URL(`https://fomo.studio/`),
  alternates: {
    canonical: `/`,
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      {
        rel: "icon",
        type: "image/png",
        url: `https://thefomo.studio/icon.png`,
      },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: `https://fomo.studio/`,
    siteName: "FOMO Studio",
    title: `FOMO Studio - AI things for the internet`,
    description:
      "A studio that builds unique and polished AI experiences for the internet.",
  },
  twitter: {
    card: "summary_large_image",
    title: `FOMO Studio - AI things for the internet`,
    description:
      "A studio that builds unique and polished AI experiences for the internet.",
    creator: "@fomo_studio",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  // themeColor: [
  //   { media: "(prefers-color-scheme: light)", color: "white" },
  //   { media: "(prefers-color-scheme: dark)", color: "black" },
  // ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-y-auto overflow-x-clip`}
      >
        {children}
      </body>
    </html>
  );
}
