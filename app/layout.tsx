import type { Metadata } from "next";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import AdminNavbar from "@/app/components/AdminNavbar"; // Import the new bar
import StudioLayoutWrapper from "@/app/components/StudioLayoutWrapper"; // Import the wrapper
import AppProviders from "./components/AppProviders";
import "./globals.css";

export const metadata: Metadata = {
  title: "Penn Rock Inventory",
  description: "Heavy Trucks & Equipment Sales",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Removed the classes here, the Wrapper handles the structure now */}
      <body className="antialiased bg-white">
        <AppProviders>
          <StudioLayoutWrapper
             publicNavbar={<Navbar />}
             publicFooter={<Footer />}
             adminNavbar={<AdminNavbar />}
          >
             {children}
          </StudioLayoutWrapper>
        </AppProviders>
      </body>
    </html>
  );
}