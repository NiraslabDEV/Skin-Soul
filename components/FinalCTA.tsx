"use client";

import { PLANTS } from "@/lib/data";

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "258840000000";

type Props = { onBook: () => void };

export default function FinalCTA({ onBook }: Props) {
  const checkoutWA = () => {
    const msg = encodeURIComponent("Olá Skin & Soul. Gostaria de saber mais sobre os vossos rituais e marcar uma sessão.");
    window.open(`https://wa.me/${WHATSAPP}?text=${msg}`, "_blank");
  };

  return (
    <section className="final-cta">
      <div className="plant plant-1" dangerouslySetInnerHTML={{ __html: PLANTS.sprig }} />
      <div className="plant plant-2" dangerouslySetInnerHTML={{ __html: PLANTS.sprig }} />
      <div className="container">
        <div className="cta-card reveal">
          <div className="plant-deco left" dangerouslySetInnerHTML={{ __html: PLANTS.sprig }} />
          <div className="plant-deco right" dangerouslySetInnerHTML={{ __html: PLANTS.sprig }} />
          <div className="eyebrow">Reserve a sua hora</div>
          <h2>Pronta para se reconectar<br />com você <em>mesma</em>?</h2>
          <p>O primeiro passo é uma conversa. Reserve a sua sessão pelo WhatsApp ou agende online — escolhemos juntas o ritual ideal.</p>
          <div className="ctas">
            <button className="btn btn-whatsapp" onClick={checkoutWA}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M17.6 14.2c-.3-.2-1.8-.9-2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.5-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.4.4-.5l.3-.4c.1-.2 0-.3 0-.5-.1-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.2 3.3 5.3 4.6.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4l-.5-.7zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.2-1.3c1.4.8 3 1.3 4.8 1.3 5.5 0 10-4.5 10-10S17.5 2 12 2z" />
              </svg>
              Agendar pelo WhatsApp
            </button>
            <button className="btn btn-light" onClick={onBook}>
              Agendar online
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
