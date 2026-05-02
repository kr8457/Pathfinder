import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "PathFinder AI",
  description: "AI placement advisor for Pakistani students finding universities and internships abroad.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-brand selection:text-black">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
