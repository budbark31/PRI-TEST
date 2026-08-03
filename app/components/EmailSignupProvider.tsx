"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import NutshellForm from "@/app/components/NutshellForm";

const STORAGE_KEY = "pri_signup_last_closed";
const SHOW_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000;
const MAILING_LIST_FORM_ID = process.env.NEXT_PUBLIC_NUTSHELL_MAILING_FORM_ID;
const MAILING_LIST_INSTANCE_ID = process.env.NEXT_PUBLIC_NUTSHELL_MAILING_INSTANCE_ID;

type EmailSignupContextValue = {
  openSignup: () => void;
};

const EmailSignupContext = createContext<EmailSignupContextValue | null>(null);

export function EmailSignupProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

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

  const value = useMemo(() => ({ openSignup }), []);
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
            Weekly drops of heavy trucks, equipment, and parts. No spam.
          </p>

          <div className="mt-5">
            {isOpen && (
              <NutshellForm
                formId={MAILING_LIST_FORM_ID}
                instanceId={MAILING_LIST_INSTANCE_ID}
                targetId="nutshell-form-mailing-list"
                className="w-full max-w-full bg-white [&_*]:bg-white"
              />
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
