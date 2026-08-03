"use client";

import ContactButtons from "@/app/components/ContactButtons";

export default function CartPageClient() {
  return (
    <div className="bg-white border-2 border-slate-900 rounded-none p-8 text-center space-y-4">
      <p className="text-lg font-semibold text-gray-900">Call, text, or email to request pricing.</p>
      <p className="text-sm text-gray-600">
        Online purchasing is not active right now. We handle orders directly.
      </p>
      <div className="max-w-md mx-auto">
        <ContactButtons truckTitle="your selected item" />
      </div>
    </div>
  );
}
