import { NextStudio } from 'next-sanity/studio'
// We use '@' to jump straight to the root folder, no matter where this file is
import config from '@/sanity.config'
import type { Metadata } from "next";

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: "PRI Manager",
  description: "Penn Rock Inventory Management System",
  robots: {
    index: false,
    follow: false,
  },
};

export default function StudioPage() {
  return <NextStudio config={config} />
}