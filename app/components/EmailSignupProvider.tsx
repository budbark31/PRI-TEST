"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { submitNetlifyForm } from "@/app/lib/netlifyForms";

const STORAGE_KEY = "pri_signup_last_closed";
const SHOW_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000;
// Signups go to the "mailing-list" Netlify form; export them as CSV into whatever tool sends the emails.
const SIGNUP_ENABLED = true;

type EmailSignupContextValue = {
  openSignup: () => void;
  isSignupEnabled: boolean;
};

const EmailSignupContext = createContext<EmailSignupContextValue | null>(null);

export function EmailSignupProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setStatus("sending");
    try {
      await submitNetlifyForm("mailing-list", {
        email: String(data.get("email") ?? ""),
        "bot-field": String(data.get("bot-field") ?? ""),
      });
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  useEffect(() => {
    const lastClosedRaw = window.localStorage.getItem(STORAGE_KEY);
    const lastClosed = lastClosedRaw ? Number(lastClosedRaw) : 0;
    const shouldShow = !lastClosed || Date.now() - lastClosed > SHOW_INTERVAL_MS;

    // Keep the signup entry point manual to avoid blocking the page UI.
    if (shouldShow) {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const openSignup = () => {
    setIsOpen(true);
  };

  const closeSignup = () => {
    window.localStorage.setItem(STORAGE_KEY, Date.now().toString());
    setIsOpen(false);
  };

  const value = useMemo(() => ({ openSignup, isSignupEnabled: SIGNUP_ENABLED }), []);
  const popoverClasses = `fixed bottom-4 left-4 right-4 z-50 w-auto max-w-none transition-all duration-200 ease-out sm:left-auto sm:right-4 sm:w-full sm:max-w-md ${
    isOpen ? "pointer-events-auto opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-2"
  }`;

  return (
    <EmailSignupContext.Provider value={value}>
      {children}
      <div className={popoverClasses} aria-hidden={!isOpen}>
        <div className="rounded-none border-2 border-slate-900 bg-white p-6 shadow-[6px_6px_0_#0f172a]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-900">Stay in the loop</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">Get new inventory alerts</h2>
            </div>
            <button
              type="button"
              onClick={closeSignup}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <p className="mt-3 text-sm text-gray-600">
            New heavy trucks and equipment as they come in. No spam.
          </p>

          <div className="mt-5">
            {status === "sent" ? (
              <p className="text-sm font-semibold text-slate-900">You&apos;re on the list. Thanks!</p>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
                <p className="hidden">
                  <label>
                    Leave this empty: <input name="bot-field" tabIndex={-1} autoComplete="off" />
                  </label>
                </p>
                <label htmlFor="signup-email" className="sr-only">Email</label>
                <input
                  id="signup-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  tabIndex={isOpen ? 0 : -1}
                  className="w-full border-2 border-slate-900 bg-white px-3 py-2 text-sm text-slate-900 rounded-none focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button
                  type="submit"
                  disabled={status === "sending"}
                  tabIndex={isOpen ? 0 : -1}
                  className="shrink-0 bg-orange-500 hover:bg-orange-600 text-white border-2 border-slate-900 font-bold uppercase tracking-widest text-sm px-4 py-2 rounded-none transition-colors disabled:opacity-60"
                >
                  {status === "sending" ? "Joining..." : "Join"}
                </button>
              </form>
            )}
            {status === "error" && (
              <p className="mt-2 text-sm text-red-600">That didn&apos;t go through. Please try again.</p>
            )}
          </div>

          <button
            type="button"
            onClick={closeSignup}
            className="mt-4 text-xs font-semibold uppercase tracking-wide text-gray-400 hover:text-gray-600"
          >
            No thanks
          </button>
        </div>
      </div>
    </EmailSignupContext.Provider>
  );
}

export function useEmailSignup() {
  const context = useContext(EmailSignupContext);
  if (!context) {
    throw new Error("useEmailSignup must be used within EmailSignupProvider");
  }
  return context;
}
