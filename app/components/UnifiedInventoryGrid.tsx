"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// Types
interface Truck {
  _id: string;
  _type: "inventory";
  title: string;
  slug: string;
  images: string[];
  price: number;
  year: number;
  make: string;
  model: string;
  hoursOrMileage: string;
  status: string;
  category: string;
}

interface Part {
  _id: string;
  _type: "part";
  title: string;
  slug: string;
  category: string;
  condition: string;
  status: string;
  price: number;
  inventoryCount: number;
  imageUrl: string | null;
}

interface UnifiedGridProps {
  trucks: Truck[];
  parts: Part[];
}

// Constants
const TRUCK_MAKES = ["Kenworth", "Peterbilt", "Mack", "Ford", "Freightliner", "International", "Other"];
const TRUCK_CATEGORIES = ["Dump Trucks", "Day Cabs", "Heavy Equipment", "Trailers"];
const PART_CATEGORIES = ["Engine", "Transmission", "Body/Cab", "Maintenance/Filters", "Accessories", "Other"];
const PART_CONDITIONS = ["New", "Used", "Rebuilt", "Core"];
const PAGE_SIZE = 12;

// Category value mappers
const truckCategoryMap: Record<string, string> = {
  "Dump Trucks": "dump-trucks",
  "Day Cabs": "day-cabs",
  "Heavy Equipment": "heavy-equipment",
  "Trailers": "trailers",
};

const partCategoryMap: Record<string, string> = {
  "Engine": "engine",
  "Transmission": "transmission",
  "Body/Cab": "body-cab",
  "Maintenance/Filters": "maintenance-filters",
  "Accessories": "accessories",
  "Other": "other",
};

const partConditionMap: Record<string, string> = {
  "New": "new",
  "Used": "used",
  "Rebuilt": "rebuilt",
  "Core": "core",
};

// Format helpers
function formatCategory(category: string): string {
  const map: Record<string, string> = {
    "engine": "Engine",
    "transmission": "Transmission",
    "body-cab": "Body/Cab",
    "maintenance-filters": "Maintenance/Filters",
    "accessories": "Accessories",
    "other": "Other",
    "dump-trucks": "Dump Trucks",
    "day-cabs": "Day Cabs",
    "heavy-equipment": "Heavy Equipment",
    "trailers": "Trailers",
  };
  return map[category] || category;
}

function formatCondition(condition: string): string {
  const map: Record<string, string> = {
    "new": "New",
    "used": "Used",
    "rebuilt": "Rebuilt",
    "core": "Core",
  };
  return map[condition] || condition;
}

export default function UnifiedInventoryGrid({ trucks, parts }: UnifiedGridProps) {
  // State
  const [activeTab, setActiveTab] = useState<"trucks" | "parts">("trucks");
  const [truckMakes, setTruckMakes] = useState<string[]>([]);
  const [truckCategories, setTruckCategories] = useState<string[]>([]);
  const [partCategories, setPartCategories] = useState<string[]>([]);
  const [partConditions, setPartConditions] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Quick Stats (count items not sold/out-of-stock - handles missing status field)
  const availableTrucks = trucks.filter((t) => t.status !== "sold").length;
  const availableParts = parts.filter((p) => p.status !== "sold" && p.status !== "out-of-stock").length;

  // Filtered data
  const filteredTrucks = useMemo(() => {
    const knownMakes = TRUCK_MAKES.filter((make) => make !== "Other");
    return trucks.filter((truck) => {
      const makeMatch =
        truckMakes.length === 0 ||
        truckMakes.some((make) =>
          make === "Other" ? !knownMakes.includes(truck.make) : truck.make === make
        );
      const categoryMatch =
        truckCategories.length === 0 || truckCategories.includes(truck.category);
      const searchMatch = !searchQuery || truck.title.toLowerCase().includes(searchQuery.toLowerCase());
      return makeMatch && categoryMatch && searchMatch;
    });
  }, [trucks, truckMakes, truckCategories, searchQuery]);

  const filteredParts = useMemo(() => {
    return parts.filter((part) => {
      const categoryMatch =
        partCategories.length === 0 || partCategories.includes(part.category);
      const conditionMatch =
        partConditions.length === 0 || partConditions.includes(part.condition);
      const searchMatch = !searchQuery || part.title.toLowerCase().includes(searchQuery.toLowerCase());
      return categoryMatch && conditionMatch && searchMatch;
    });
  }, [parts, partCategories, partConditions, searchQuery]);

  const displayedItems = activeTab === "trucks" ? filteredTrucks : filteredParts;
  const visibleItems = useMemo(() => displayedItems.slice(0, visibleCount), [displayedItems, visibleCount]);

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, displayedItems.length));
  }, [displayedItems.length]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activeTab, truckMakes, truckCategories, partCategories, partConditions, searchQuery]);

  useEffect(() => {
    if (visibleCount > displayedItems.length) {
      setVisibleCount(displayedItems.length);
    }
  }, [displayedItems.length, visibleCount]);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && visibleCount < displayedItems.length) {
          loadMore();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [loadMore, visibleCount, displayedItems.length]);

  return (
    <div>
      {/* Header Section with Toggle, Stats & Search */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-8">
        {/* Quick Stats */}
        <div className="flex justify-center gap-8 mb-4">
          <div className="text-center">
            <span className="text-2xl font-bold text-slate-900">{availableTrucks}</span>
            <span className="text-gray-500 ml-2">Trucks Available</span>
          </div>
          <div className="w-px bg-gray-300"></div>
          <div className="text-center">
            <span className="text-2xl font-bold text-orange-500">{availableParts}</span>
            <span className="text-gray-500 ml-2">Parts in Stock</span>
          </div>
        </div>

        {/* Master Toggle */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex bg-white rounded-xl p-1.5 shadow-sm border border-gray-200">
            <button
              onClick={() => setActiveTab("trucks")}
              className={`px-8 py-4 rounded-lg font-bold text-base transition-all ${
                activeTab === "trucks"
                  ? "bg-slate-900 text-white shadow-md"
                  : "text-gray-600 hover:text-slate-900 hover:bg-gray-50"
              }`}
            >
              Trucks & Heavy Equipment
            </button>
            <button
              onClick={() => setActiveTab("parts")}
              className={`px-8 py-4 rounded-lg font-bold text-base transition-all ${
                activeTab === "parts"
                  ? "bg-slate-900 text-white shadow-md"
                  : "text-gray-600 hover:text-slate-900 hover:bg-gray-50"
              }`}
            >
              Parts & Accessories
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex justify-center mb-4">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder={activeTab === "trucks" ? "Search trucks..." : "Search parts..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-10 rounded-lg border-2 border-gray-200 bg-white text-gray-700 font-medium focus:border-slate-900 focus:outline-none"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 w-full">
          {activeTab === "trucks" ? (
            <>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <span className="text-sm font-semibold text-gray-600 mr-2">Make:</span>
                <button
                  onClick={() => setTruckMakes([])}
                  className={`px-3 py-1 rounded-full text-sm font-semibold border transition-colors ${
                    truckMakes.length === 0
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-gray-600 border-gray-200 hover:border-slate-900 hover:text-slate-900"
                  }`}
                >
                  All
                </button>
                {TRUCK_MAKES.map((make) => (
                  <button
                    key={make}
                    onClick={() =>
                      setTruckMakes((prev) =>
                        prev.includes(make) ? prev.filter((m) => m !== make) : [...prev, make]
                      )
                    }
                    className={`px-3 py-1 rounded-full text-sm font-semibold border transition-colors ${
                      truckMakes.includes(make)
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-gray-600 border-gray-200 hover:border-slate-900 hover:text-slate-900"
                    }`}
                  >
                    {make}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2">
                <span className="text-sm font-semibold text-gray-600 mr-2">Category:</span>
                <button
                  onClick={() => setTruckCategories([])}
                  className={`px-3 py-1 rounded-full text-sm font-semibold border transition-colors ${
                    truckCategories.length === 0
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-gray-600 border-gray-200 hover:border-slate-900 hover:text-slate-900"
                  }`}
                >
                  All
                </button>
                {TRUCK_CATEGORIES.map((label) => {
                  const value = truckCategoryMap[label];
                  return (
                    <button
                      key={value}
                      onClick={() =>
                        setTruckCategories((prev) =>
                          prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]
                        )
                      }
                      className={`px-3 py-1 rounded-full text-sm font-semibold border transition-colors ${
                        truckCategories.includes(value)
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-white text-gray-600 border-gray-200 hover:border-slate-900 hover:text-slate-900"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <span className="text-sm font-semibold text-gray-600 mr-2">Category:</span>
                <button
                  onClick={() => setPartCategories([])}
                  className={`px-3 py-1 rounded-full text-sm font-semibold border transition-colors ${
                    partCategories.length === 0
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-gray-600 border-gray-200 hover:border-slate-900 hover:text-slate-900"
                  }`}
                >
                  All
                </button>
                {PART_CATEGORIES.map((label) => {
                  const value = partCategoryMap[label];
                  return (
                    <button
                      key={value}
                      onClick={() =>
                        setPartCategories((prev) =>
                          prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]
                        )
                      }
                      className={`px-3 py-1 rounded-full text-sm font-semibold border transition-colors ${
                        partCategories.includes(value)
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-white text-gray-600 border-gray-200 hover:border-slate-900 hover:text-slate-900"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2">
                <span className="text-sm font-semibold text-gray-600 mr-2">Condition:</span>
                <button
                  onClick={() => setPartConditions([])}
                  className={`px-3 py-1 rounded-full text-sm font-semibold border transition-colors ${
                    partConditions.length === 0
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-gray-600 border-gray-200 hover:border-slate-900 hover:text-slate-900"
                  }`}
                >
                  All
                </button>
                {PART_CONDITIONS.map((label) => {
                  const value = partConditionMap[label];
                  return (
                    <button
                      key={value}
                      onClick={() =>
                        setPartConditions((prev) =>
                          prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]
                        )
                      }
                      className={`px-3 py-1 rounded-full text-sm font-semibold border transition-colors ${
                        partConditions.includes(value)
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-white text-gray-600 border-gray-200 hover:border-slate-900 hover:text-slate-900"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* Clear Filters */}
          <div className="flex justify-center">
            <button
              onClick={() => {
                setTruckMakes([]);
                setTruckCategories([]);
                setPartCategories([]);
                setPartConditions([]);
                setSearchQuery("");
              }}
              className="px-4 py-2 rounded-lg border-2 border-orange-500 text-orange-500 font-medium hover:bg-orange-500 hover:text-white transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-center text-gray-500 mb-6">
        Showing {displayedItems.length} {activeTab === "trucks" ? "vehicles" : "parts"}
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayedItems.length > 0 ? (
          visibleItems.map((item) =>
            activeTab === "trucks" ? (
              <TruckCard key={item._id} truck={item as Truck} />
            ) : (
              <PartCard key={item._id} part={item as Part} />
            )
          )
        ) : (
          <div className="col-span-full text-center py-20 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xl text-gray-600 font-bold">No items found.</p>
            <p className="text-gray-500 mt-2">Try adjusting your filters.</p>
          </div>
        )}
      </div>

      {displayedItems.length > 0 && visibleCount < displayedItems.length && (
        <div className="flex justify-center py-8 text-gray-500">
          Loading more items...
        </div>
      )}
      <div ref={loadMoreRef} className="h-8" />
    </div>
  );
}

// Truck Card Component
function TruckCard({ truck }: { truck: Truck }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const images = truck.images || [];
  const currentImage = images[currentImageIndex];
  const isSold = truck.status === "sold";

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };
  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div
      className={`group border rounded-lg overflow-hidden transition-all bg-white flex flex-col ${
        isSold ? "border-gray-200 opacity-80" : "border-gray-200 hover:shadow-lg hover:-translate-y-1"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-64 w-full bg-gray-100">
        <Link href={`/inventory/${truck.slug}`} className="absolute inset-0 z-0">
          {currentImage ? (
            <Image
              src={currentImage}
              alt={truck.title}
              fill
              className={`object-cover transition-all duration-500 ${isSold ? "grayscale contrast-125" : ""}`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
          )}
        </Link>

        {isSold && (
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none bg-black/10">
            <div className="border-4 border-red-600 text-red-600 font-black text-4xl px-6 py-2 -rotate-12 bg-white/90 shadow-xl tracking-widest uppercase">
              SOLD
            </div>
          </div>
        )}

        {!isSold && images.length > 1 && isHovered && (
          <>
            <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full z-10 hover:bg-black/70">
              &#8249;
            </button>
            <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full z-10 hover:bg-black/70">
              &#8250;
            </button>
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10">
              {images.map((_, idx) => (
                <div key={idx} className={`h-1.5 w-1.5 rounded-full shadow-sm ${idx === currentImageIndex ? "bg-white" : "bg-white/50"}`} />
              ))}
            </div>
          </>
        )}

        {!isSold && (
          <div className={`absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded uppercase shadow-sm z-10 ${
            truck.status === "pending" ? "bg-orange-500 text-white" : "bg-green-600 text-white"
          }`}>
            {truck.status === "pending" ? "Pending Sale" : "Available"}
          </div>
        )}
      </div>

      <Link href={`/inventory/${truck.slug}`} className="flex flex-col flex-grow">
        <div className="p-4 flex flex-col flex-grow">
          <div className="mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {formatCategory(truck.category)}
            </span>
          </div>

          <h3 className={`text-lg font-bold line-clamp-1 mb-1 ${isSold ? "text-gray-500 line-through decoration-gray-400" : "text-gray-900"}`}>
            {truck.title}
          </h3>

          <p className="text-gray-500 text-sm mb-4">
            {truck.year} • {truck.make} • {truck.hoursOrMileage}
          </p>

          <div className="mt-auto flex items-center justify-between border-t pt-4">
            <span className={`text-2xl font-bold ${isSold ? "text-gray-400" : "text-blue-900"}`}>
              {truck.price ? `$${truck.price.toLocaleString()}` : "Call for Price"}
            </span>

            {!isSold && (
              <span className="text-sm font-medium text-gray-600 group-hover:text-blue-900">
                View Details &rarr;
              </span>
            )}

            {isSold && (
              <span className="text-sm font-bold text-red-600 uppercase tracking-wider">
                Sold
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}

// Part Card Component
function PartCard({ part }: { part: Part }) {
  const isSold = part.status === "sold";
  const isOutOfStock = part.status === "out-of-stock";

  return (
    <Link
      href={`/parts/${part.slug}`}
      className={`group border rounded-lg overflow-hidden transition-all bg-white flex flex-col ${
        isSold ? "border-gray-200 opacity-80" : "border-gray-200 hover:shadow-lg hover:-translate-y-1"
      }`}
    >
      <div className="relative h-64 w-full bg-gray-100">
        {part.imageUrl ? (
          <Image
            src={part.imageUrl}
            alt={part.title}
            fill
            className={`object-cover transition-all duration-500 ${isSold ? "grayscale contrast-125" : ""}`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {isSold && (
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none bg-black/10">
            <div className="border-4 border-red-600 text-red-600 font-black text-4xl px-6 py-2 -rotate-12 bg-white/90 shadow-xl tracking-widest uppercase">
              SOLD
            </div>
          </div>
        )}

        {!isSold && (
          <div className={`absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded uppercase shadow-sm z-10 ${
            isOutOfStock ? "bg-orange-500 text-white" : "bg-green-600 text-white"
          }`}>
            {isOutOfStock ? "Out of Stock" : "Available"}
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="mb-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            {formatCategory(part.category)}
          </span>
        </div>

        <h3 className={`text-lg font-bold line-clamp-1 mb-1 ${isSold ? "text-gray-500 line-through decoration-gray-400" : "text-gray-900"}`}>
          {part.title}
        </h3>

        <p className="text-gray-500 text-sm mb-4">
          {formatCondition(part.condition)}
          {part.inventoryCount !== null && part.inventoryCount !== undefined && (
            <> • {part.inventoryCount > 0 ? `${part.inventoryCount} in stock` : "Out of stock"}</>
          )}
        </p>

        <div className="mt-auto flex items-center justify-between border-t pt-4">
          <span className={`text-2xl font-bold ${isSold ? "text-gray-400" : "text-blue-900"}`}>
            {part.price ? `$${part.price.toLocaleString()}` : "Call for Price"}
          </span>

          {!isSold && (
            <span className="text-sm font-medium text-gray-600 group-hover:text-blue-900">
              View Details &rarr;
            </span>
          )}

          {isSold && (
            <span className="text-sm font-bold text-red-600 uppercase tracking-wider">
              Sold
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
