import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trial Project KATALIS",
  description: "Modern admin dashboard built with Next.js and Tailwind CSS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
