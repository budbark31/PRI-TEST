"use client";

import ContactButtons from "@/app/components/ContactButtons";

export default function CheckoutButton({
  title,
}: {
  title?: string;
}) {
  return (
    <div className="w-full">
      <ContactButtons truckTitle={title || "this item"} />
    </div>
  );
}
