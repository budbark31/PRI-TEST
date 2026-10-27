"use client";

import { useState } from "react";
import { submitNetlifyForm } from "@/app/lib/netlifyForms";

type Status = "idle" | "sending" | "sent" | "error";

const inputClasses =
  "w-full border-2 border-slate-900 bg-white px-3 py-2 text-sm text-slate-900 rounded-none focus:outline-none focus:ring-2 focus:ring-orange-500";
const labelClasses = "block text-xs font-bold uppercase tracking-widest text-slate-900 mb-1";

export default function InquiryForm({ truckTitle }: { truckTitle: string }) {
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const fields: Record<string, string> = { truck: truckTitle };
    data.forEach((value, key) => {
      fields[key] = String(value);
    });

    setStatus("sending");
    try {
      await submitNetlifyForm("truck-inquiry", fields);
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <p className="text-sm font-semibold text-slate-900">
        Thanks! We got your message about the {truckTitle} and will get back to you soon.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <p className="hidden">
        <label>
          Leave this empty: <input name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </p>
      <div>
        <label className={labelClasses} htmlFor="inquiry-name">Name</label>
        <input id="inquiry-name" name="name" required autoComplete="name" className={inputClasses} />
      </div>
      <div>
        <label className={labelClasses} htmlFor="inquiry-email">Email</label>
        <input id="inquiry-email" name="email" type="email" required autoComplete="email" className={inputClasses} />
      </div>
      <div>
        <label className={labelClasses} htmlFor="inquiry-phone">Phone (optional)</label>
        <input id="inquiry-phone" name="phone" type="tel" autoComplete="tel" className={inputClasses} />
      </div>
      <div>
        <label className={labelClasses} htmlFor="inquiry-message">Message</label>
        <textarea
          id="inquiry-message"
          name="message"
          rows={4}
          required
          defaultValue={`I'm interested in the ${truckTitle}.`}
          className={inputClasses}
        />
      </div>
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full bg-slate-900 hover:bg-orange-500 text-white border-2 border-slate-900 font-bold uppercase tracking-widest text-sm py-3 rounded-none transition-colors disabled:opacity-60"
      >
        {status === "sending" ? "Sending..." : "Send Message"}
      </button>
      {status === "error" && (
        <p className="text-sm text-red-600">
          That didn&apos;t go through. Please call or text 610-507-4832.
        </p>
      )}
    </form>
  );
}
