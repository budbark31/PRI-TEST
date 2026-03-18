"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface GalleryProps {
  images: string[];
  title: string;
}

export default function ImageGallery({ images, title }: GalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Open Lightbox to specific image
  const openLightbox = () => {
    // Find index of currently selected image
    const index = images.indexOf(selectedImage);
    setLightboxIndex(index >= 0 ? index : 0);
    setIsLightboxOpen(true);
  };

  // Close Lightbox
  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  // Navigate Lightbox
  const showNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setLightboxIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const showPrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setLightboxIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  // Keyboard Support (Escape to close, Arrows to navigate)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, showNext, showPrev]);

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* 1. Main Image (Click to Open Lightbox) */}
        <div 
          className="relative aspect-video w-full bg-gray-100 rounded-none overflow-hidden border-2 border-slate-900 shadow-[4px_4px_0_#0f172a] cursor-zoom-in group"
          onClick={openLightbox}
        >
          <Image
            src={selectedImage}
            alt={`Main view of ${title}`}
            fill
            className="object-cover transition-opacity duration-300"
            priority
            sizes="(max-width: 1024px) 100vw, 60vw"
          />
          
          {/* Zoom Hint Icon (Appears on Hover) */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
             <span className="opacity-0 group-hover:opacity-100 bg-slate-900 text-white px-3 py-1 rounded-none text-xs font-bold uppercase tracking-widest transition-opacity border border-white/20">
               Click to Expand 🔍
             </span>
          </div>
        </div>

        {/* 2. Thumbnail Grid */}
        {images.length > 1 && (
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(img)}
                className={`relative h-20 w-full rounded-none overflow-hidden border-2 transition-all ${
                  selectedImage === img
                    ? "border-slate-900 shadow-[3px_3px_0_#0f172a]"
                    : "border-gray-300 hover:border-slate-900 opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={img}
                  alt={`View ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 3. THE LIGHTBOX OVERLAY */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeLightbox} // Click outside to close
        >
          {/* Close Button */}
          <button 
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2 z-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Previous Arrow */}
          <button 
            onClick={showPrev}
            className="absolute left-4 text-white/70 hover:text-white p-4 hidden md:block z-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* The Big Image */}
          <div className="relative w-full max-w-6xl h-full max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[lightboxIndex]}
              alt={`Fullscreen view ${lightboxIndex + 1}`}
              fill
              className="object-contain" // Ensures the whole truck fits on screen
              quality={85}
            />
          </div>

          {/* Next Arrow */}
          <button 
            onClick={showNext}
            className="absolute right-4 text-white/70 hover:text-white p-4 hidden md:block z-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 font-mono text-sm">
             {lightboxIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}