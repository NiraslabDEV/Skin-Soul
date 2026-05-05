"use client";

import { useState } from "react";
import { CATEGORIES, SERVICES, PACKAGES, PLANTS, ICONS } from "@/lib/data";
import { fmt } from "@/lib/utils";
import { useCart } from "./CartProvider";

export default function ServicesSection() {
  const [activeCat, setActiveCat] = useState("all");
  const { addToCart } = useCart();

  const list = activeCat === "all" ? SERVICES : SERVICES.filter((s) => s.cat === activeCat);

  return (
    <>
      {/* SERVICES */}
      <section className="services" id="services">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="section-eyebrow">Serviços</div>
              <h2 className="section-title reveal">Rituais para cada<br />parte de <em>você</em>.</h2>
            </div>
            <div className="right">
              <p className="section-lede reveal">Cinco categorias, dezenas de tratamentos. Reserve individualmente ou monte o seu próprio percurso.</p>
            </div>
          </div>
          <div className="cat-tabs">
            {CATEGORIES.map((c) => (
              <button key={c.id} className={`cat-tab${activeCat === c.id ? " active" : ""}`} onClick={() => setActiveCat(c.id)}>{c.name}</button>
            ))}
          </div>
          <div className="services-grid">
            {list.map((s) => (
              <article className="svc-card" key={s.id}>
                <div className="svc-icon" dangerouslySetInnerHTML={{ __html: ICONS[s.icon as keyof typeof ICONS] || ICONS.facial }} />
                <div className="svc-cat">{s.catLabel}</div>
                <h3>{s.name}</h3>
                <p>{s.desc}</p>
                <div className="svc-meta">
                  <div className="svc-price">
                    <span className="from">a partir de</span>
                    {fmt(s.price)}
                  </div>
                  <div className="svc-duration" dangerouslySetInnerHTML={{ __html: ICONS.clock + `${s.duration} min` }} />
                </div>
                <button className="svc-add" onClick={() => addToCart(s.id)}>
                  <span dangerouslySetInnerHTML={{ __html: ICONS.plus }} />
                  Adicionar ao ritual
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PACKAGES */}
      <section className="packages" id="packages">
        <div className="plant plant-1" dangerouslySetInnerHTML={{ __html: PLANTS.sprig }} />
        <div className="container">
          <div className="section-head">
            <div>
              <div className="section-eyebrow">Pacotes &amp; Combos</div>
              <h2 className="section-title reveal">Percursos que<br /><em>continuam</em> consigo.</h2>
            </div>
            <div className="right">
              <p className="section-lede reveal">Combos pensados para resultados sustentados — porque a transformação verdadeira acontece com tempo e presença.</p>
            </div>
          </div>
          <div className="pkg-grid">
            {PACKAGES.map((p) => (
              <article className={`pkg-card${p.featured ? " featured" : ""}`} key={p.id}>
                {p.tag && <span className="pkg-tag">{p.tag}</span>}
                <div className="pkg-photo">
                  <span className="label">[ photo · {p.name} ]</span>
                </div>
                <div className="pkg-body">
                  <div className="pkg-cat">{p.cat} · {p.duration}</div>
                  <h3>{p.name}</h3>
                  <p className="pkg-desc">{p.desc}</p>
                  <ul className="pkg-includes">
                    {p.includes.map((inc) => (
                      <li key={inc}>
                        <span dangerouslySetInnerHTML={{ __html: ICONS.check }} />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pkg-foot">
                    <div className="pkg-price-row">
                      <div className="pkg-price">
                        <span className="currency">MT</span>
                        {p.price.toLocaleString("pt-PT").replace(/,/g, " ")}
                      </div>
                      {p.originalPrice && <div className="pkg-original">{fmt(p.originalPrice)}</div>}
                    </div>
                    <button className="pkg-add" onClick={() => addToCart(p.id)}>
                      <span dangerouslySetInnerHTML={{ __html: ICONS.plus }} />
                      Adicionar ao ritual
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
