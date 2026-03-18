"use client";

import { CartProvider } from "@/app/components/CartProvider";
import { EmailSignupProvider } from "@/app/components/EmailSignupProvider";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <EmailSignupProvider>{children}</EmailSignupProvider>
    </CartProvider>
  );
}
