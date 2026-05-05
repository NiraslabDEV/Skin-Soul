"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useCart } from "./CartProvider";

type Props = {
  onOpenCart: () => void;
  onOpenBooking: () => void;
};

export default function Nav({ onOpenCart, onOpenBooking }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const { cartCount } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`nav${scrolled ? " scrolled" : ""}`} id="nav">
      <div className="container nav-row">
        <a href="#" className="brand">
          <span className="brand-mark">
            <Image src="/logo.png" alt="Skin & Soul" width={46} height={46} style={{ width: "120%", height: "120%", objectFit: "cover", objectPosition: "center 35%" }} />
          </span>
          <span className="brand-text">
            <span className="name">Skin &amp; Soul</span>
            <span className="tag">Estética com propósito</span>
          </span>
        </a>

        <div className="nav-links">
          <a href="#experience">A experiência</a>
          <a href="#services">Serviços</a>
          <a href="#signature">Rituais</a>
          <a href="#packages">Pacotes</a>
          <a href="#testimonials">Histórias</a>
        </div>

        <div className="nav-actions">
          <button className="icon-btn" onClick={onOpenBooking} aria-label="Agendar">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 9h18M8 3v4M16 3v4" />
            </svg>
          </button>
          <button className="icon-btn" onClick={onOpenCart} aria-label="Carrinho">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 4h2l2.5 12h11l2-9H6" /><circle cx="9" cy="20" r="1.5" /><circle cx="18" cy="20" r="1.5" />
            </svg>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
          <button className="btn btn-primary" onClick={onOpenBooking}>
            Agendar
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
