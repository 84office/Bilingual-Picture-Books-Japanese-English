import type { Metadata } from "next";
import { Noto_Sans_JP, Mochiy_Pop_One } from "next/font/google";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-noto-sans-jp",
});

const mochiyPopOne = Mochiy_Pop_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-mochiy-pop-one",
});

export const metadata: Metadata = {
  title: "AIバイリンガルえほんメーカー｜Bilingual Picture Books",
  description: "An application for parents and young children to collaboratively create one-of-a-kind picture books with the power of AI. Input a few details and watch a unique story with illustrations come to life.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${notoSansJP.variable} ${mochiyPopOne.variable}`}>
      <body className="bg-amber-50 font-sans">{children}</body>
    </html>
  );
}
