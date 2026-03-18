"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "pri_signup_last_closed";
const SHOW_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000;

type EmailSignupContextValue = {
  openSignup: () => void;
};

const EmailSignupContext = createContext<EmailSignupContextValue | null>(null);

export function EmailSignupProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const lastClosedRaw = window.localStorage.getItem(STORAGE_KEY);
      const lastClosed = lastClosedRaw ? Number(lastClosedRaw) : 0;
      const shouldShow = !lastClosed || Date.now() - lastClosed > SHOW_INTERVAL_MS;

      if (shouldShow) {
        setIsOpen(true);
      }
    }, 3500);

    return () => window.clearTimeout(timer);
  }, []);

  const openSignup = () => {
    setSubmitted(false);
    setEmail("");
    setIsOpen(true);
  };

  const closeSignup = () => {
    window.localStorage.setItem(STORAGE_KEY, Date.now().toString());
    setIsOpen(false);
    setSubmitted(false);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!email || !email.includes("@")) {
      return;
    }

    setSubmitted(true);
    window.localStorage.setItem(STORAGE_KEY, Date.now().toString());
  };

  const value = useMemo(() => ({ openSignup }), []);

  return (
    <EmailSignupContext.Provider value={value}>
      {children}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-none border-2 border-slate-900 bg-white p-6 shadow-[6px_6px_0_#0f172a]">
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
              Weekly drops of heavy trucks, equipment, and parts. No spam.
            </p>

            {submitted ? (
              <div className="mt-5 rounded-none border-2 border-slate-900 bg-gray-100 p-4 text-xs font-bold uppercase tracking-widest text-slate-900">
                Thanks! You are on the list. We will send the next update soon.
              </div>
            ) : (
              <form className="mt-5 space-y-3" onSubmit={handleSubmit}>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-none border-2 border-slate-900 px-3 py-2 text-sm focus:outline-none"
                />
                <button
                  type="submit"
                  className="w-full rounded-none border-2 border-slate-900 bg-orange-500 px-4 py-2 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-orange-600"
                >
                  Join the list
                </button>
                <p className="text-xs text-gray-500">By signing up you agree to receive email updates.</p>
              </form>
            )}

            <button
              type="button"
              onClick={closeSignup}
              className="mt-4 text-xs font-semibold uppercase tracking-wide text-gray-400 hover:text-gray-600"
            >
              No thanks
            </button>
          </div>
        </div>
      )}
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
