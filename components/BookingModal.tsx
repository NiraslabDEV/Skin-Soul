"use client";

import { useState } from "react";
import { SERVICES, PACKAGES, getSvc } from "@/lib/data";
import { fmt } from "@/lib/utils";

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "258840000000";

type Props = { open: boolean; onClose: () => void; prefId?: string };

type Booking = {
  step: number;
  serviceId: string;
  notes: string;
  date: string | null;
  time: string | null;
};

export default function BookingModal({ open, onClose, prefId }: Props) {
  const [booking, setBooking] = useState<Booking>({ step: 1, serviceId: prefId || "", notes: "", date: null, time: null });
  const [client, setClient] = useState({ name: "", phone: "", email: "" });

  const s = booking.serviceId ? getSvc(booking.serviceId) : null;

  const getDays = () => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return Array.from({ length: 21 }, (_, i) => {
      const d = new Date(today); d.setDate(today.getDate() + i);
      return d;
    });
  };

  const getSlots = () => {
    if (!booking.date) return [];
    const d = new Date(booking.date);
    const sat = d.getDay() === 6;
    const end = sat ? 16 : 19;
    const slots: string[] = [];
    for (let h = 9; h < end; h++) {
      slots.push(`${String(h).padStart(2, "0")}:00`);
      slots.push(`${String(h).padStart(2, "0")}:30`);
    }
    return slots;
  };

  const isTaken = (slot: string, idx: number) => {
    if (!booking.date) return false;
    const seed = booking.date.split("-").reduce((a, b) => a + parseInt(b), 0);
    return (idx * 7 + seed) % 9 < 3;
  };

  const goNext = () => {
    if (booking.step === 1 && !booking.serviceId) { alert("Por favor escolha um tratamento."); return; }
    if (booking.step === 2 && !booking.date) { alert("Escolha uma data disponível."); return; }
    if (booking.step === 3 && !booking.time) { alert("Escolha um horário disponível."); return; }
    if (booking.step === 4) {
      if (!client.name || !client.phone) { alert("Preencha nome e telefone."); return; }
      finalize();
      return;
    }
    setBooking((b) => ({ ...b, step: b.step + 1 }));
  };

  const goBack = () => setBooking((b) => ({ ...b, step: b.step - 1 }));

  const finalize = async () => {
    if (!s || !booking.date || !booking.time) return;
    const body = {
      serviceId: booking.serviceId,
      serviceName: s.name,
      price: s.price,
      duration: String((s as any).duration),
      date: booking.date,
      time: booking.time,
      clientName: client.name,
      clientPhone: client.phone,
      clientEmail: client.email,
      notes: booking.notes,
    };
    try {
      const res = await fetch("/api/appointments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const appt = await res.json();
      const date = new Date(booking.date);
      const dStr = date.toLocaleDateString("pt-PT", { weekday: "long", day: "numeric", month: "long" });
      const msg = encodeURIComponent(
        `Olá Skin & Soul. Gostaria de confirmar a minha reserva:\n\n• Ritual: ${s.name}\n• Data: ${dStr} às ${booking.time}\n• Duração: ${(s as any).duration}${typeof (s as any).duration === "number" ? " min" : ""}\n• Total: ${fmt(s.price)}\n\nNome: ${client.name}\nTelefone: ${client.phone}${client.email ? `\nEmail: ${client.email}` : ""}${booking.notes ? `\n\nNotas: ${booking.notes}` : ""}\n\nCódigo: ${appt.id}`
      );
      window.open(`https://wa.me/${WHATSAPP}?text=${msg}`, "_blank");
    } catch {
      alert("Erro ao guardar. Tente de novo.");
      return;
    }
    onClose();
    setBooking({ step: 1, serviceId: "", notes: "", date: null, time: null });
    setClient({ name: "", phone: "", email: "" });
  };

  const dows = ["D", "S", "T", "Q", "Q", "S", "S"];

  return (
    <div className={`modal-backdrop${open ? " open" : ""}`} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-head">
          <h3>Reservar sessão</h3>
          <button className="close" onClick={onClose} aria-label="Fechar">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M6 6l12 12M6 18L18 6" /></svg>
          </button>
        </div>

        <div className="modal-body">
          <div className="book-stepper">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className={`step${n < booking.step ? " done" : ""}${n === booking.step ? " current" : ""}`} />
            ))}
          </div>

          {/* Step 1 */}
          <div className={`book-step${booking.step === 1 ? " active" : ""}`}>
            <div className="field">
              <label>Escolha o seu ritual</label>
              <select value={booking.serviceId} onChange={(e) => setBooking((b) => ({ ...b, serviceId: e.target.value }))}>
                <option value="">— Selecione um tratamento —</option>
                <optgroup label="Tratamentos">
                  {SERVICES.map((sv) => <option key={sv.id} value={sv.id}>{sv.name} · {fmt(sv.price)} · {sv.duration}min</option>)}
                </optgroup>
                <optgroup label="Pacotes">
                  {PACKAGES.map((p) => <option key={p.id} value={p.id}>{p.name} · {fmt(p.price)} · {p.duration}</option>)}
                </optgroup>
              </select>
            </div>
            <div className="field">
              <label>Notas (opcional)</label>
              <textarea placeholder="Conte-nos algo sobre si — alergias, preferências, intenções para esta sessão..." value={booking.notes} onChange={(e) => setBooking((b) => ({ ...b, notes: e.target.value }))} />
            </div>
          </div>

          {/* Step 2 */}
          <div className={`book-step${booking.step === 2 ? " active" : ""}`}>
            <label style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--emerald)", marginBottom: 12, display: "block", fontWeight: 500 }}>Escolha o dia</label>
            <div className="date-grid">
              {getDays().map((d) => {
                const dow = d.getDay();
                const disabled = dow === 0;
                const iso = d.toISOString().slice(0, 10);
                const sel = booking.date === iso;
                return (
                  <button key={iso} className={`date-cell${disabled ? " disabled" : ""}${sel ? " selected" : ""}`} disabled={disabled} onClick={() => setBooking((b) => ({ ...b, date: iso, time: null }))}>
                    <span className="dow">{dows[dow]}</span>
                    <span className="d">{d.getDate()}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3 */}
          <div className={`book-step${booking.step === 3 ? " active" : ""}`}>
            <label style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--emerald)", marginBottom: 12, display: "block", fontWeight: 500 }}>Horários disponíveis</label>
            <div className="time-grid">
              {getSlots().map((slot, idx) => {
                const taken = isTaken(slot, idx);
                const sel = booking.time === slot;
                return (
                  <button key={slot} className={`time-cell${taken ? " disabled" : ""}${sel ? " selected" : ""}`} disabled={taken} onClick={() => setBooking((b) => ({ ...b, time: slot }))}>
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 4 */}
          <div className={`book-step${booking.step === 4 ? " active" : ""}`}>
            {s && booking.date && booking.time && (
              <div className="summary">
                <h4>Resumo da reserva</h4>
                <div className="summary-row"><span className="l">Ritual</span><span className="v">{s.name}</span></div>
                <div className="summary-row"><span className="l">Data</span><span className="v">{new Date(booking.date).toLocaleDateString("pt-PT", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</span></div>
                <div className="summary-row"><span className="l">Hora</span><span className="v">{booking.time}</span></div>
                <div className="summary-row"><span className="l">Duração</span><span className="v">{(s as any).duration}{typeof (s as any).duration === "number" ? " min" : ""}</span></div>
                <div className="summary-row total"><span className="l">Total</span><span className="v">{fmt(s.price)}</span></div>
              </div>
            )}
            <div className="field-row">
              <div className="field">
                <label>Nome</label>
                <input placeholder="O seu nome" value={client.name} onChange={(e) => setClient((c) => ({ ...c, name: e.target.value }))} />
              </div>
              <div className="field">
                <label>Telefone</label>
                <input placeholder="84 000 0000" value={client.phone} onChange={(e) => setClient((c) => ({ ...c, phone: e.target.value }))} />
              </div>
            </div>
            <div className="field">
              <label>Email (opcional)</label>
              <input type="email" placeholder="exemplo@email.com" value={client.email} onChange={(e) => setClient((c) => ({ ...c, email: e.target.value }))} />
            </div>
          </div>
        </div>

        <div className="modal-foot">
          <button className="btn btn-ghost" style={{ color: "var(--emerald)", visibility: booking.step === 1 ? "hidden" : "visible" }} onClick={goBack}>Voltar</button>
          <button className="btn btn-primary" onClick={goNext}>
            {booking.step === 4 ? (
              <>Confirmar via WhatsApp <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M17.6 14.2c-.3-.2-1.8-.9-2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.5-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.4.4-.5l.3-.4c.1-.2 0-.3 0-.5-.1-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.2 3.3 5.3 4.6.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4l-.5-.7zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.2-1.3c1.4.8 3 1.3 4.8 1.3 5.5 0 10-4.5 10-10S17.5 2 12 2z" /></svg></>
            ) : (
              <>Continuar <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 12h14M13 6l6 6-6 6" /></svg></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
