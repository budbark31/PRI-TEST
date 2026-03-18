"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";

export default function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentCategory = searchParams.get("category") || "all";

  // These must match the "value" you set in Sanity Schema exactly
  const categories = [
    { label: "All Inventory", value: "all" },
    { label: "Dump Trucks", value: "dump-trucks" },
    { label: "Day Cabs", value: "day-cabs" },
    { label: "Heavy Equipment", value: "heavy-equipment" },
    { label: "Trailers", value: "trailers" },
  ];

  const handleFilter = (categoryValue: string) => {
    if (categoryValue === "all") {
      router.push("/"); // Clear the filter
    } else {
      router.push(`/?category=${categoryValue}`); // Set the filter
    }
  };

  // Check if we're on the parts page
  const isPartsPage = pathname === "/parts";

  return (
    <div className="flex flex-wrap gap-2 mb-8 justify-center md:justify-start">
      {categories.map((cat) => (
        <button
          key={cat.value}
          onClick={() => handleFilter(cat.value)}
          className={`px-4 py-2 rounded-none text-xs font-bold uppercase tracking-widest transition-all border-2 ${
            currentCategory === cat.value && !isPartsPage
              ? "bg-slate-900 text-white border-slate-900 shadow-[4px_4px_0_#0f172a]"
              : "bg-white text-slate-900 border-slate-900 hover:bg-slate-900 hover:text-white"
          }`}
        >
          {cat.label}
        </button>
      ))}
      {/* Parts links to separate page */}
      <Link
        href="/parts"
        className={`px-4 py-2 rounded-none text-xs font-bold uppercase tracking-widest transition-all border-2 ${
          isPartsPage
            ? "bg-slate-900 text-white border-slate-900 shadow-[4px_4px_0_#0f172a]"
            : "bg-white text-slate-900 border-slate-900 hover:bg-slate-900 hover:text-white"
        }`}
      >
        Parts
      </Link>
    </div>
  );
}