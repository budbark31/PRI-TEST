import type { Metadata } from "next";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import AdminNavbar from "@/app/components/AdminNavbar"; // Import the new bar
import StudioLayoutWrapper from "@/app/components/StudioLayoutWrapper"; // Import the wrapper
import AppProviders from "./components/AppProviders";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "@/app/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: "Heavy trucks, day cabs, trailers, and heavy equipment consignment sales from Penn Rock Industries.",
  keywords: [
    "Penn Rock Industries",
    "heavy trucks",
    "dump trucks",
    "day cabs",
    "trailers",
    "heavy equipment",
    "consignment",
  ],
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    url: SITE_URL,
    title: SITE_NAME,
    description: "Heavy trucks, day cabs, trailers, and heavy equipment consignment sales from Penn Rock Industries.",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: "Heavy trucks, day cabs, trailers, and heavy equipment consignment sales from Penn Rock Industries.",
    images: [DEFAULT_OG_IMAGE],
  },
  icons: {
    icon: "/icon.jpg",
    apple: "/icon.jpg",
  },
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