"use client";

import { useState } from "react";

type Member = {
  name: string;
  role: string;
  bio: string;
};

export default function TeamCard({ member }: { member: Member }) {
  const [open, setOpen] = useState(false);
  const previewLength = 180;
  const isLong = member.bio.length > previewLength;
  const preview = isLong ? `${member.bio.slice(0, previewLength).trim()}...` : member.bio;

  return (
    <div className="bg-white border-2 border-slate-900 rounded-none p-8 text-center hover:shadow-[4px_4px_0_#0f172a] transition-shadow flex flex-col">
      <div className="w-32 h-32 mx-auto mb-6 rounded-none bg-gray-100 border-2 border-slate-900 flex items-center justify-center flex-shrink-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1}
          stroke="currentColor"
          className="w-12 h-12 text-gray-300"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
          />
        </svg>
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>

      <p className="text-slate-900 font-bold uppercase tracking-widest text-xs">{member.role}</p>

      <div className="mt-4 text-gray-700 text-left text-sm leading-relaxed flex-1">
        <p>{open ? member.bio : preview}</p>
      </div>

      {isLong && (
        <button
          onClick={() => setOpen((s) => !s)}
          className="mt-4 self-start text-slate-900 font-semibold text-sm"
        >
          {open ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}
