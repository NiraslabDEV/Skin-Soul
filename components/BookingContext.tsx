"use client";

import { createContext, useContext, useState } from "react";

type Ctx = { openBooking: () => void; openCart: () => void };
const BookingCtx = createContext<Ctx>({ openBooking: () => {}, openCart: () => {} });

export function BookingProvider({ children, onOpenBooking, onOpenCart }: { children: React.ReactNode; onOpenBooking: () => void; onOpenCart: () => void }) {
  return <BookingCtx.Provider value={{ openBooking: onOpenBooking, openCart: onOpenCart }}>{children}</BookingCtx.Provider>;
}

export function useBooking() {
  return useContext(BookingCtx);
}
