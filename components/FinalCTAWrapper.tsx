"use client";

import { useBooking } from "./BookingContext";
import FinalCTA from "./FinalCTA";

export default function FinalCTAWrapper() {
  const { openBooking } = useBooking();
  return <FinalCTA onBook={openBooking} />;
}
