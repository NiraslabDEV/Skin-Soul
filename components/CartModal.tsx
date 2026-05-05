"use client";

import { useCart } from "./CartProvider";
import { getSvc } from "@/lib/data";
import { fmt } from "@/lib/utils";

type Props = { open: boolean; onClose: () => void; onBook: () => void };

export default function CartModal({ open, onClose, onBook }: Props) {
  const { cart, removeFromCart, changeQty, cartTotal } = useCart();

  const isPkg = (id: string) => {
    const s = getSvc(id);
    return s && "includes" in s;
  };

  return (
    <div className={`modal-backdrop${open ? " open" : ""}`} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal wide">
        <div className="modal-head">
          <h3>O seu ritual</h3>
          <button className="close" onClick={onClose} aria-label="Fechar">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M3 4h2l2.5 12h11l2-9H6" /><circle cx="9" cy="20" r="1.5" /><circle cx="18" cy="20" r="1.5" />
              </svg>
              <h4>O seu ritual aguarda</h4>
              <p>Adicione tratamentos para começar a desenhar a sua sessão.</p>
            </div>
          ) : (
            <div className="cart-list">
              {cart.map((c) => {
                const s = getSvc(c.id);
                if (!s) return null;
                const pkg = isPkg(c.id);
                return (
                  <div className="cart-item" key={c.id}>
                    <div className="info">
                      <div className="cat">{pkg ? (s as any).cat : (s as any).catLabel}</div>
                      <h4>{s.name}</h4>
                      <div className="meta">
                        <span>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
                          {pkg ? (s as any).duration : `${(s as any).duration} min`}
                        </span>
                      </div>
                    </div>
                    <div className="actions">
                      <div className="price">{fmt(s.price * c.qty)}</div>
                      <div className="qty">
                        <button onClick={() => changeQty(c.id, -1)} aria-label="Menos">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 12h14" /></svg>
                        </button>
                        <span className="n">{c.qty}</span>
                        <button onClick={() => changeQty(c.id, 1)} aria-label="Mais">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 5v14M5 12h14" /></svg>
                        </button>
                      </div>
                      <button className="remove" onClick={() => removeFromCart(c.id)}>Remover</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="modal-foot">
            <div className="total">
              <span className="lbl">Total</span>
              <span className="val">{fmt(cartTotal)}</span>
            </div>
            <button className="btn btn-ghost" onClick={onClose} style={{ color: "var(--emerald)" }}>Continuar</button>
            <button className="btn btn-primary" onClick={() => { onClose(); onBook(); }}>
              Marcar data
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
