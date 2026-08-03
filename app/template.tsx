"use client";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        opacity: 1,
        transition: "opacity 0.5s ease-in-out",
      }}
    >
      {children}
    </div>
  );
}