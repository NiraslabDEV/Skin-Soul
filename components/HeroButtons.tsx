"use client";

import { useBooking } from "./BookingContext";

export default function HeroButtons() {
  const { openBooking } = useBooking();
  return (
    <>
      <button className="btn btn-light" onClick={openBooking}>
        Reservar sessão
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </button>
      <a href="#services" className="btn btn-ghost">Ver rituais</a>
    </>
  );
}
