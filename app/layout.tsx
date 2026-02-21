import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blå Tur - Årlig Rejse",
  description: "En hjemmeside for vores årlige grupperejse",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="da">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

