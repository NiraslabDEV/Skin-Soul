"use client";

import { useState } from "react";
import { CartProvider } from "./CartProvider";
import { BookingProvider } from "./BookingContext";
import Nav from "./Nav";
import CartModal from "./CartModal";
import BookingModal from "./BookingModal";
import RevealWrapper from "./RevealWrapper";

export default function PageClient({ children }: { children: React.ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);

  return (
    <CartProvider>
      <BookingProvider onOpenBooking={() => setBookOpen(true)} onOpenCart={() => setCartOpen(true)}>
        <RevealWrapper />
        <Nav onOpenCart={() => setCartOpen(true)} onOpenBooking={() => setBookOpen(true)} />
        {children}

        <a href="/dashboard" className="dash-fab">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" />
            <rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" />
          </svg>
          Painel interno
        </a>

        <CartModal open={cartOpen} onClose={() => setCartOpen(false)} onBook={() => setBookOpen(true)} />
        <BookingModal open={bookOpen} onClose={() => setBookOpen(false)} />
      </BookingProvider>
    </CartProvider>
  );
}
