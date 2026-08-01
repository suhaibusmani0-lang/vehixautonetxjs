import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// Ye dono imports zaroori hain
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vehix Auto Parts - Premium Brands",
  description: "Shop premium auto parts for European, Japanese, and American vehicles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        {/* Header sabse upar */}
        <Header />
        
        {/* Main content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Footer sabse niche */}
        <Footer />
      </body>
    </html>
  );
}