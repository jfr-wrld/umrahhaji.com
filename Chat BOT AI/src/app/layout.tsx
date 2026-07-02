import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UmrahHaji",
  description: "Platform terpercaya untuk perjalanan ibadah Umrah dan Haji Anda.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning className={`${plusJakartaSans.className} min-h-full flex flex-col font-sans`}>{children}</body>
    </html>
  );
}
