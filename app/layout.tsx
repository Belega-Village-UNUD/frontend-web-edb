import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

import Footer from "@/components/footer/Footer";
import NavBar from "@/components/nav/NavBar";
import Providers from "@/components/Providers";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "B-Commerce",
  description: "Bamboo Crafts Online Marketplace",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={`${poppins.className} text-slate-700`}>
        <Providers>
          <div className="flex flex-col min-h-screen bg-green-50">
            <Toaster richColors />
            <NavBar />
            <main className="flew-grow">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
