"use client";

import { EmailSignupProvider } from "@/app/components/EmailSignupProvider";

/*
import { CartProvider } from "@/app/components/CartProvider";
*/

export default function AppProviders({ children }: { children: React.ReactNode }) {
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
