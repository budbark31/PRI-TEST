"use client";

import { useEffect } from "react";
import { EmailSignupProvider } from "@/app/components/EmailSignupProvider";

/*
import { CartProvider } from "@/app/components/CartProvider";
*/

const NUTSHELL_SCRIPT_SRC = "https://loader.nutshell.com/nutsheller-esm.js";
const NUTSHELL_SCRIPT_ATTR = "data-nutsheller-script";

type NutshellerFn = ((...args: unknown[]) => void) & { q?: unknown[][] };

type NutshellWindow = Window & {
  Nutsheller?: NutshellerFn;
};

const ensureNutshellerQueue = () => {
  const win = window as NutshellWindow;
  if (win.Nutsheller) return;

  const queueFn: NutshellerFn = (...args: unknown[]) => {
    queueFn.q = queueFn.q || [];
    queueFn.q.push(args);
  };

  win.Nutsheller = queueFn;
};

const ensureNutshellerScript = () => {
  if (document.querySelector(`script[src="${NUTSHELL_SCRIPT_SRC}"]`)) return;
  if (document.querySelector(`script[${NUTSHELL_SCRIPT_ATTR}]`)) return;

  const script = document.createElement("script");
  script.src = NUTSHELL_SCRIPT_SRC;
  script.type = "module";
  script.async = true;
  script.crossOrigin = "anonymous";
  script.setAttribute(NUTSHELL_SCRIPT_ATTR, "true");
  document.head.appendChild(script);
};

export default function AppProviders({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    ensureNutshellerQueue();
    ensureNutshellerScript();
  }, []);

  return (
    <EmailSignupProvider>{children}</EmailSignupProvider>
  );
}

/*
export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <EmailSignupProvider>{children}</EmailSignupProvider>
    </CartProvider>
  );
}
*/
