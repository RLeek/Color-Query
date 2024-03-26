import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Color query",
  description: "Query and manipulate the pixels of a picture to gain a deeper understanding of what makes it tick!.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-zinc-100">{children}</body>
    </html>
  );
}
