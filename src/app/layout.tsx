import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "預かり保育予約管理",
  description: "預かり保育の予約管理サイトです",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning={true}>
      <body>{children}</body>
    </html>
  );
}
