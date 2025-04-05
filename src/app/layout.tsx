import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gantt chart with Next.JS",
  description: "Gantt Chartt created by vibe coding",
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
