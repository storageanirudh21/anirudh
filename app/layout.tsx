import type { Metadata } from "next";
import { Albert_Sans, Fragment_Mono } from "next/font/google";
import "./globals.css";

const albertSans = Albert_Sans({
  variable: "--font-albert-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const fragmentMono = Fragment_Mono({
  variable: "--font-fragment-mono",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Anirudh — Portfolio",
  description: "Building beyond possible.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${albertSans.variable} ${fragmentMono.variable} h-full antialiased`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://db.onlinewebfonts.com/c/5ac3fe7c6abd2f62067f266d89671492?family=HelveticaNowDisplay-Medium"
          type="text/css"
        />
        <link
          rel="stylesheet"
          href="https://db.onlinewebfonts.com/c/1aa3377e489837a26d019bba501e779d?family=HelveticaNowDisplayW01-Rg"
          type="text/css"
        />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
