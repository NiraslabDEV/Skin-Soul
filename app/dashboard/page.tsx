"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { SERVICES, PACKAGES, getSvc } from "@/lib/data";
import { fmt, formatDate, statLabel } from "@/lib/utils";

type Appt = {
  id: string; serviceId: string; serviceName: string; price: number; duration: string;
  date: string; time: string; status: string; notes: string; createdAt: string;
  clientName: string; clientPhone: string; clientEmail: string;
};

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "258840000000";

export default function Dashboard() {
  const [view, setView] = useState("overview");
  const [appts, setAppts] = useState<Appt[]>([]);
  const [loading, setLoading] = useState(true);
  const [day, setDay] = useState(0);
  const [filter, setFilter] = useState("all");
  const [svcCat, setSvcCat] = useState("all");
  const [search, setSearch] = useState("");
  const [apptSearch, setApptSearch] = useState("");
  const [selectedAppt, setSelectedAppt] = useState<Appt | null>(null);
  const [newModal, setNewModal] = useState(false);
  const [newForm, setNewForm] = useState({ svc: "", date: "", time: "10:00", name: "", phone: "", notes: "" });

  const loadAppts = useCallback(async () => {
    try {
      const res = await fetch("/api/appointments");
      const data = await res.json();
      setAppts(Array.isArray(data) ? data : []);
    } catch { setAppts([]); }
    setLoading(false);
  }, []);

  useEffect(() => { loadAppts(); }, [loadAppts]);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/appointments/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    setSelectedAppt(null);
    loadAppts();
  };

  const cancelAppt = async (id: string) => {
    if (!confirm("Cancelar esta reserva?")) return;
    await updateStatus(id, "cancelled");
  };

  const saveNew = async () => {
    const s = getSvc(newForm.svc);
    if (!s || !newForm.name || !newForm.phone || !newForm.date || !newForm.time) { alert("Preencha todos os campos."); return; }
    await fetch("/api/appointments", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ serviceId: newForm.svc, serviceName: s.name, price: s.price, duration: String((s as any).duration), date: newForm.date, time: newForm.time, clientName: newForm.name, clientPhone: newForm.phone, clientEmail: "", notes: newForm.notes, status: "confirmed" }),
    });
    setNewModal(false);
    loadAppts();
  };

  const waAppt = (a: Appt) => {
    const phone = (a.clientPhone || "").replace(/\D/g, "") || WHATSAPP;
    const msg = encodeURIComponent(`Olá ${a.clientName.split(" ")[0]}, aqui é da Skin & Soul. Estou a confirmar a sua reserva de ${a.serviceName} em ${formatDate(a.date)} às ${a.time}. Aguardo confirmação.`);
    window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
  };

  // KPIs
  const today = new Date().toISOString().slice(0, 10);
  const todayAppts = appts.filter((a) => a.date === today);
  const weekAppts = appts.filter((a) => { const diff = (new Date(a.date).getTime() - Date.now()) / 86400000; return diff >= -1 && diff <= 7; });
  const monthAppts = appts.filter((a) => { const d = new Date(a.date), n = new Date(); return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear(); });
  const monthRev = monthAppts.filter((a) => a.status !== "cancelled").reduce((s, a) => s + a.price, 0);
  const uniqueClients = new Set(appts.filter((a) => (Date.now() - new Date(a.date).getTime()) / 86400000 < 30).map((a) => a.clientPhone)).size;
  const pendingCount = appts.filter((a) => a.status === "pending").length;

  // Schedule
  const dayDate = (() => { const d = new Date(); d.setDate(d.getDate() + day); return d.toISOString().slice(0, 10); })();
  const daySchedule = appts.filter((a) => a.date === dayDate).sort((a, b) => a.time.localeCompare(b.time));
  const sat = new Date(dayDate).getDay() === 6;
  const slots: string[] = [];
  for (let h = 9; h < (sat ? 16 : 19); h++) { slots.push(`${String(h).padStart(2, "0")}:00`); slots.push(`${String(h).padStart(2, "0")}:30`); }

  // Top services
  const recent = appts.filter((a) => (Date.now() - new Date(a.date).getTime()) / 86400000 < 30 && a.status !== "cancelled");
  const tally: Record<string, number> = {};
  recent.forEach((a) => { tally[a.serviceId] = (tally[a.serviceId] || 0) + 1; });
  const top = Object.entries(tally).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxTop = top.length ? top[0][1] : 1;

  // Recent table
  const recentFiltered = appts.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .filter((a) => !search || a.clientName.toLowerCase().includes(search.toLowerCase()) || a.serviceName.toLowerCase().includes(search.toLowerCase()))
    .slice(0, 8);

  // Appointments view
  const apptFiltered = appts.slice().sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time))
    .filter((a) => { if (filter !== "all" && a.status !== filter) return false; if (apptSearch && !a.clientName.toLowerCase().includes(apptSearch.toLowerCase()) && !a.serviceName.toLowerCase().includes(apptSearch.toLowerCase())) return false; return true; });

  // Clients
  const clientMap: Record<string, { name: string; phone: string; count: number; total: number; last: string }> = {};
  appts.forEach((a) => {
    const k = a.clientPhone || a.clientName;
    if (!clientMap[k]) clientMap[k] = { name: a.clientName, phone: a.clientPhone, count: 0, total: 0, last: a.date };
    clientMap[k].count++;
    if (a.status !== "cancelled") clientMap[k].total += a.price;
    if (a.date > clientMap[k].last) clientMap[k].last = a.date;
  });
  const clients = Object.values(clientMap).sort((a, b) => b.total - a.total);

  // Finance
  const realized = monthAppts.filter((a) => a.status === "done" || a.status === "confirmed");
  const projected = monthAppts.filter((a) => a.status !== "cancelled");
  const finMonth = realized.reduce((s, a) => s + a.price, 0);
  const finProjected = projected.reduce((s, a) => s + a.price, 0);
  const finAvg = realized.length ? Math.round(finMonth / realized.length) : 0;
  const catTally: Record<string, { count: number; total: number }> = {};
  realized.forEach((a) => {
    const s = getSvc(a.serviceId);
    const cat = s ? ((s as any).catLabel ? ((s as any).catLabel.split(" · ")[0] || (s as any).catLabel) : ((s as any).cat || "Pacote")) : "Outro";
    if (!catTally[cat]) catTally[cat] = { count: 0, total: 0 };
    catTally[cat].count++;
    catTally[cat].total += a.price;
  });
  const finTotal = Object.values(catTally).reduce((s, c) => s + c.total, 0) || 1;
  const finRows = Object.entries(catTally).sort((a, b) => b[1].total - a[1].total);

  // Services catalog
  let svcList: any[] = [];
  if (svcCat === "all") svcList = [...SERVICES, ...PACKAGES.map((p) => ({ ...p, catLabel: p.cat }))];
  else if (svcCat === "pkg") svcList = PACKAGES.map((p) => ({ ...p, catLabel: p.cat }));
  else svcList = SERVICES.filter((s) => s.cat === svcCat);

  const svcCats = [{ id: "all", name: "Todos" }, { id: "facial", name: "Faciais" }, { id: "derm", name: "Dermaplaning" }, { id: "body", name: "Corporais" }, { id: "exf", name: "Esfoliação" }, { id: "depil", name: "Depilação" }, { id: "bright", name: "Clareamento" }, { id: "lash", name: "Pestanas" }, { id: "pkg", name: "Pacotes" }];

  const navItems = [
    { id: "overview", label: "Visão geral", svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" /></svg> },
    { id: "appointments", label: "Agendamentos", badge: pendingCount, svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 9h18M8 3v4M16 3v4" /></svg> },
    { id: "clients", label: "Clientes", svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="9" cy="8" r="4" /><path d="M2 21c0-3.5 3-6 7-6s7 2.5 7 6M17 11a3 3 0 100-6M22 21c0-2.5-1.5-4.5-4-5.5" /></svg> },
    { id: "services", label: "Serviços", svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 3l9 4-9 4-9-4 9-4z" /><path d="M3 12l9 4 9-4M3 17l9 4 9-4" /></svg> },
    { id: "finance", label: "Financeiro", svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 17l5-5 4 4 8-8" /><path d="M14 8h7v7" /></svg> },
  ];

  return (
    <div className="app">
      {/* SIDEBAR */}
      <aside className="side">
        <a href="/" className="brand">
          <div className="brand-mark">
            <Image src="/logo.png" alt="Skin & Soul" width={46} height={46} style={{ width: "120%", height: "120%", objectFit: "cover", objectPosition: "center 35%" }} />
          </div>
          <div className="brand-text"><div className="name">Skin &amp; Soul</div><div className="tag">Painel interno</div></div>
        </a>

        <div className="side-section">Visão geral</div>
        {navItems.map((n) => (
          <button key={n.id} className={`nav-item${view === n.id ? " active" : ""}`} onClick={() => setView(n.id)}>
            {n.svg}
            {n.label}
            {n.badge ? <span className="badge">{n.badge}</span> : null}
          </button>
        ))}
        <div className="side-section">Atalhos</div>
        <a className="nav-item" href="/">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          Ver site público
        </a>
        <div className="side-foot">Sessão · Erica<br /><a href="/">Sair</a></div>
      </aside>

      {/* MAIN */}
      <main className="dash-main">
        {loading && <div className="empty">A carregar...</div>}

        {/* OVERVIEW */}
        {view === "overview" && !loading && (
          <>
            <div className="bar">
              <div>
                <h1>Bom dia, Erica.</h1>
                <div className="sub">{new Date().toLocaleDateString("pt-PT", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</div>
              </div>
              <div className="bar-actions">
                <button className="dash-btn dash-btn-light" onClick={() => setNewModal(true)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 5v14M5 12h14" /></svg>
                  Novo agendamento
                </button>
              </div>
            </div>

            <div className="kpis">
              <div className="kpi dark">
                <span className="kpi-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 9h18" /></svg></span>
                <span className="lbl">Agendamentos hoje</span>
                <span className="val">{todayAppts.length}</span>
                <span className="sub">Sessões marcadas</span>
              </div>
              <div className="kpi">
                <span className="kpi-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg></span>
                <span className="lbl">Esta semana</span>
                <span className="val">{weekAppts.length}</span>
                <span className="sub">Reservas activas</span>
              </div>
              <div className="kpi">
                <span className="kpi-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2v20M5 7h11a3 3 0 010 6H8a3 3 0 000 6h11" /></svg></span>
                <span className="lbl">Receita do mês</span>
                <span className="val">{fmt(monthRev)}</span>
                <span className="sub">Confirmadas e concluídas</span>
              </div>
              <div className="kpi">
                <span className="kpi-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="9" cy="8" r="4" /><path d="M2 21c0-3.5 3-6 7-6s7 2.5 7 6" /></svg></span>
                <span className="lbl">Clientes activas</span>
                <span className="val">{uniqueClients}</span>
                <span className="sub">Últimos 30 dias</span>
              </div>
            </div>

            <div className="panels">
              <div className="panel">
                <div className="panel-head">
                  <h3>Agenda</h3>
                  <div className="right">
                    <div className="day-tabs">
                      {[{ d: 0, l: "Hoje" }, { d: 1, l: "Amanhã" }, { d: 2, l: "+2 dias" }].map((t) => (
                        <button key={t.d} className={`day-tab${day === t.d ? " active" : ""}`} onClick={() => setDay(t.d)}>{t.l}</button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="panel-body">
                  <div className="timeline">
                    {slots.map((t) => {
                      const appt = daySchedule.find((a) => a.time === t);
                      return (
                        <div className="tl-row" key={t}>
                          <span className="tl-time">{t}</span>
                          {appt ? (
                            <div className="tl-card" style={{ cursor: "pointer" }} onClick={() => setSelectedAppt(appt)}>
                              <div><div className="name">{appt.clientName}</div><div className="meta">{appt.serviceName} · {appt.duration}{!isNaN(Number(appt.duration)) ? " min" : ""}</div></div>
                              <span className={`stat stat-${appt.status}`}>{statLabel(appt.status)}</span>
                            </div>
                          ) : (
                            <div className="tl-card empty">— livre —</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="panel">
                <div className="panel-head"><h3>Mais procurados</h3></div>
                <div className="panel-body">
                  <div className="top-list">
                    {top.length ? top.map(([id, n], i) => {
                      const s = getSvc(id);
                      return s ? (
                        <div className="top-item" key={id}>
                          <div className="top-rank">{String(i + 1).padStart(2, "0")}</div>
                          <div className="top-info">
                            <div className="nm">{s.name}</div>
                            <div className="ct">{(s as any).catLabel || (s as any).cat}</div>
                            <div className="top-bar"><span style={{ width: `${(n / maxTop) * 100}%` }} /></div>
                          </div>
                          <div className="top-num">{n}</div>
                        </div>
                      ) : null;
                    }) : <div className="empty">Sem dados ainda.</div>}
                  </div>
                </div>
                <div className="panel-foot"><span>Últimos 30 dias</span><span>{recent.length} sessões</span></div>
              </div>
            </div>

            <div className="table-wrap">
              <div className="table-head">
                <h3>Reservas recentes</h3>
                <div className="search-input">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></svg>
                  <input placeholder="Procurar por nome, ritual..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
              </div>
              <table className="tbl">
                <thead><tr><th>Cliente</th><th>Ritual</th><th className="tbl-mobile-hide">Data</th><th className="tbl-mobile-hide">Estado</th><th>Total</th><th /></tr></thead>
                <tbody>
                  {recentFiltered.length ? recentFiltered.map((a) => (
                    <tr key={a.id}>
                      <td><div className="nm">{a.clientName}</div><div className="sub">{a.clientPhone}</div></td>
                      <td><div className="nm" style={{ fontSize: 14 }}>{a.serviceName}</div><div className="sub">{a.duration}{!isNaN(Number(a.duration)) ? " min" : ""}</div></td>
                      <td className="tbl-mobile-hide"><div className="nm" style={{ fontSize: 14 }}>{formatDate(a.date)}</div><div className="sub">{a.time}</div></td>
                      <td className="tbl-mobile-hide"><span className={`stat stat-${a.status}`}>{statLabel(a.status)}</span></td>
                      <td><span className="price">{fmt(a.price)}</span></td>
                      <td><div className="tbl-actions">
                        <button className="icon-act" title="Detalhes" onClick={() => setSelectedAppt(a)}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 8v.01M12 11v5" /></svg></button>
                        <button className="icon-act wa" title="WhatsApp" onClick={() => waAppt(a)}><svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.6 14.2c-.3-.2-1.8-.9-2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.5-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.4.4-.5l.3-.4c.1-.2 0-.3 0-.5-.1-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.2 3.3 5.3 4.6.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4l-.5-.7zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.2-1.3c1.4.8 3 1.3 4.8 1.3 5.5 0 10-4.5 10-10S17.5 2 12 2z" /></svg></button>
                      </div></td>
                    </tr>
                  )) : <tr><td colSpan={6}><div className="empty">Sem reservas. Crie um novo agendamento.</div></td></tr>}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* APPOINTMENTS */}
        {view === "appointments" && !loading && (
          <>
            <div className="bar">
              <div><h1>Agendamentos</h1><div className="sub">Todas as reservas, em ordem cronológica.</div></div>
              <div className="bar-actions"><button className="dash-btn dash-btn-primary" onClick={() => setNewModal(true)}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 5v14M5 12h14" /></svg>Novo agendamento</button></div>
            </div>
            <div className="table-wrap">
              <div className="table-head">
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {["all", "pending", "confirmed", "done"].map((f) => (
                    <button key={f} className={`day-tab${filter === f ? " active" : ""}`} onClick={() => setFilter(f)}>
                      {{ all: "Todos", pending: "Pendentes", confirmed: "Confirmados", done: "Concluídos" }[f]}
                    </button>
                  ))}
                </div>
                <div className="search-input">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></svg>
                  <input placeholder="Procurar..." value={apptSearch} onChange={(e) => setApptSearch(e.target.value)} />
                </div>
              </div>
              <table className="tbl">
                <thead><tr><th>Código</th><th>Cliente</th><th>Ritual</th><th>Data &amp; Hora</th><th>Estado</th><th>Total</th><th /></tr></thead>
                <tbody>
                  {apptFiltered.length ? apptFiltered.map((a) => (
                    <tr key={a.id}>
                      <td><span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--emerald)", letterSpacing: ".04em" }}>{a.id.slice(0, 8)}</span></td>
                      <td><div className="nm">{a.clientName}</div><div className="sub">{a.clientPhone}</div></td>
                      <td><div className="nm" style={{ fontSize: 14 }}>{a.serviceName}</div></td>
                      <td><div className="nm" style={{ fontSize: 14 }}>{formatDate(a.date)}</div><div className="sub">{a.time}</div></td>
                      <td><span className={`stat stat-${a.status}`}>{statLabel(a.status)}</span></td>
                      <td><span className="price">{fmt(a.price)}</span></td>
                      <td><div className="tbl-actions">
                        <button className="icon-act" onClick={() => setSelectedAppt(a)}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></svg></button>
                        <button className="icon-act wa" onClick={() => waAppt(a)}><svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.6 14.2c-.3-.2-1.8-.9-2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.5-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.4.4-.5l.3-.4c.1-.2 0-.3 0-.5-.1-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.2 3.3 5.3 4.6.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4l-.5-.7zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.2-1.3c1.4.8 3 1.3 4.8 1.3 5.5 0 10-4.5 10-10S17.5 2 12 2z" /></svg></button>
                        <button className="icon-act danger" onClick={() => cancelAppt(a.id)}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M6 6l12 12M6 18L18 6" /></svg></button>
                      </div></td>
                    </tr>
                  )) : <tr><td colSpan={7}><div className="empty">Sem reservas para este filtro.</div></td></tr>}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* CLIENTS */}
        {view === "clients" && !loading && (
          <>
            <div className="bar"><div><h1>Clientes</h1><div className="sub">As mulheres e homens que escolheram este santuário.</div></div></div>
            <div className="client-grid">
              {clients.length ? clients.map((c) => (
                <div className="client-card" key={c.phone || c.name}>
                  <div className="top">
                    <div className="avatar">{c.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}</div>
                    <div><div className="nm">{c.name}</div><div className="ph">{c.phone || "—"}</div></div>
                  </div>
                  <div className="client-meta">
                    <div><div className="l">Sessões</div><div className="v">{c.count}</div></div>
                    <div><div className="l">Investido</div><div className="v">{fmt(c.total)}</div></div>
                    <div><div className="l">Última visita</div><div className="v" style={{ fontSize: 13 }}>{formatDate(c.last)}</div></div>
                    <div><div className="l">Estado</div><div className="v" style={{ fontSize: 13, color: "var(--sage)" }}>Activa</div></div>
                  </div>
                </div>
              )) : <div className="empty" style={{ gridColumn: "1/-1" }}>Sem clientes ainda.</div>}
            </div>
          </>
        )}

        {/* SERVICES */}
        {view === "services" && (
          <>
            <div className="bar"><div><h1>Catálogo de serviços</h1><div className="sub">Todos os tratamentos, pacotes e preços.</div></div></div>
            <div className="svc-cats">
              {svcCats.map((c) => <button key={c.id} className={svcCat === c.id ? "active" : ""} onClick={() => setSvcCat(c.id)}>{c.name}</button>)}
            </div>
            <div className="table-wrap">
              <table className="tbl">
                <thead><tr><th>Tratamento</th><th>Categoria</th><th>Duração</th><th>Preço</th></tr></thead>
                <tbody>
                  {svcList.map((s) => (
                    <tr key={s.id}>
                      <td><div className="nm">{s.name}</div><div className="sub">{s.desc || ""}</div></td>
                      <td><div className="sub" style={{ fontSize: 12 }}>{s.catLabel}</div></td>
                      <td><div className="sub" style={{ fontSize: 13 }}>{s.duration}{typeof s.duration === "number" ? " min" : ""}</div></td>
                      <td><span className="price">{fmt(s.price)}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* FINANCE */}
        {view === "finance" && (
          <>
            <div className="bar"><div><h1>Financeiro</h1><div className="sub">Performance e receita.</div></div></div>
            <div className="kpis">
              <div className="kpi"><span className="lbl">Receita do mês</span><span className="val">{fmt(finMonth)}</span><span className="sub">Confirmadas e concluídas</span></div>
              <div className="kpi"><span className="lbl">Receita projectada</span><span className="val">{fmt(finProjected)}</span><span className="sub">Inclui pendentes</span></div>
              <div className="kpi"><span className="lbl">Ticket médio</span><span className="val">{fmt(finAvg)}</span><span className="sub">Por sessão</span></div>
              <div className="kpi"><span className="lbl">Sessões realizadas</span><span className="val">{realized.length}</span><span className="sub">No mês</span></div>
            </div>
            <div className="table-wrap">
              <div className="table-head"><h3>Receita por categoria</h3></div>
              <table className="tbl">
                <thead><tr><th>Categoria</th><th>Sessões</th><th>Receita</th><th>% do total</th></tr></thead>
                <tbody>
                  {finRows.length ? finRows.map(([cat, d]) => (
                    <tr key={cat}>
                      <td><div className="nm" style={{ fontSize: 15 }}>{cat}</div></td>
                      <td>{d.count}</td>
                      <td><span className="price">{fmt(d.total)}</span></td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div className="top-bar" style={{ flex: 1, maxWidth: 160 }}><span style={{ width: `${(d.total / finTotal) * 100}%` }} /></div>
                          <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--muted)" }}>{Math.round((d.total / finTotal) * 100)}%</span>
                        </div>
                      </td>
                    </tr>
                  )) : <tr><td colSpan={4}><div className="empty">Sem dados.</div></td></tr>}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>

      {/* APPT DETAIL MODAL */}
      {selectedAppt && (
        <div className="modal-bd open" onClick={(e) => e.target === e.currentTarget && setSelectedAppt(null)}>
          <div className="modal">
            <div className="modal-h">
              <h3>Reserva · {selectedAppt.id.slice(0, 8)}</h3>
              <button className="x" onClick={() => setSelectedAppt(null)}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M6 6l12 12M6 18L18 6" /></svg>
              </button>
            </div>
            <div className="modal-b">
              {[
                ["Cliente", selectedAppt.clientName],
                ["Telefone", selectedAppt.clientPhone || "—"],
                selectedAppt.clientEmail ? ["Email", selectedAppt.clientEmail] : null,
                ["Ritual", selectedAppt.serviceName],
                ["Data", `${formatDate(selectedAppt.date)} · ${selectedAppt.time}`],
                ["Duração", `${selectedAppt.duration}${!isNaN(Number(selectedAppt.duration)) ? " min" : ""}`],
                ["Preço", fmt(selectedAppt.price)],
              ].filter(Boolean).map((row) => (
                <div className="detail-row" key={row![0]}>
                  <span className="k">{row![0]}</span>
                  <span className="v">{row![1]}</span>
                </div>
              ))}
              <div className="detail-row">
                <span className="k">Estado</span>
                <span className="v"><span className={`stat stat-${selectedAppt.status}`}>{statLabel(selectedAppt.status)}</span></span>
              </div>
              {selectedAppt.notes && (
                <div className="detail-row">
                  <span className="k">Notas</span>
                  <span className="v" style={{ fontSize: 14, fontStyle: "italic", color: "var(--muted)" }}>&ldquo;{selectedAppt.notes}&rdquo;</span>
                </div>
              )}
            </div>
            <div className="modal-f">
              <button className="dash-btn dash-btn-light" onClick={() => setSelectedAppt(null)}>Fechar</button>
              <button className="dash-btn dash-btn-wa" onClick={() => waAppt(selectedAppt)}>
                <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13"><path d="M17.6 14.2c-.3-.2-1.8-.9-2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.5-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.4.4-.5l.3-.4c.1-.2 0-.3 0-.5-.1-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.2 3.3 5.3 4.6.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4l-.5-.7zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.2-1.3c1.4.8 3 1.3 4.8 1.3 5.5 0 10-4.5 10-10S17.5 2 12 2z" /></svg>
                Contactar
              </button>
              {selectedAppt.status === "pending" && <button className="dash-btn dash-btn-primary" onClick={() => updateStatus(selectedAppt.id, "confirmed")}>Confirmar</button>}
              {selectedAppt.status === "confirmed" && <button className="dash-btn dash-btn-primary" onClick={() => updateStatus(selectedAppt.id, "done")}>Marcar concluído</button>}
            </div>
          </div>
        </div>
      )}

      {/* NEW APPT MODAL */}
      {newModal && (
        <div className="modal-bd open" onClick={(e) => e.target === e.currentTarget && setNewModal(false)}>
          <div className="modal">
            <div className="modal-h">
              <h3>Novo agendamento</h3>
              <button className="x" onClick={() => setNewModal(false)}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M6 6l12 12M6 18L18 6" /></svg>
              </button>
            </div>
            <div className="modal-b">
              <div className="field"><label>Ritual</label>
                <select value={newForm.svc} onChange={(e) => setNewForm((f) => ({ ...f, svc: e.target.value }))}>
                  <option value="">— Selecione —</option>
                  <optgroup label="Tratamentos">{SERVICES.map((s) => <option key={s.id} value={s.id}>{s.name} · {fmt(s.price)}</option>)}</optgroup>
                  <optgroup label="Pacotes">{PACKAGES.map((p) => <option key={p.id} value={p.id}>{p.name} · {fmt(p.price)}</option>)}</optgroup>
                </select>
              </div>
              <div className="field-row">
                <div className="field"><label>Data</label><input type="date" value={newForm.date} onChange={(e) => setNewForm((f) => ({ ...f, date: e.target.value }))} /></div>
                <div className="field"><label>Hora</label><input type="time" value={newForm.time} onChange={(e) => setNewForm((f) => ({ ...f, time: e.target.value }))} /></div>
              </div>
              <div className="field-row">
                <div className="field"><label>Nome da cliente</label><input placeholder="Nome completo" value={newForm.name} onChange={(e) => setNewForm((f) => ({ ...f, name: e.target.value }))} /></div>
                <div className="field"><label>Telefone</label><input placeholder="84 000 0000" value={newForm.phone} onChange={(e) => setNewForm((f) => ({ ...f, phone: e.target.value }))} /></div>
              </div>
              <div className="field"><label>Notas</label><textarea rows={2} placeholder="Preferências, alergias, intenções..." value={newForm.notes} onChange={(e) => setNewForm((f) => ({ ...f, notes: e.target.value }))} /></div>
            </div>
            <div className="modal-f">
              <button className="dash-btn dash-btn-light" onClick={() => setNewModal(false)}>Cancelar</button>
              <button className="dash-btn dash-btn-primary" onClick={saveNew}>Criar reserva</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
