import type { Metadata } from "next";
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
  title: "Siemens Tech Summit 2026",
  description: "Official registration microsite for Siemens Tech Summit 2026.",
  icons: {
    icon: [{ url: "/logos.png", type: "image/png" }],
    shortcut: ["/logos.png"],
    apple: [{ url: "/logos.png", type: "image/png" }],
  },
  openGraph: {
    title: "Siemens Tech Summit 2026",
    description: "Official registration microsite for Siemens Tech Summit 2026.",
    images: [{ url: "/logos.png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
