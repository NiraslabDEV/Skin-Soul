import Image from "next/image";
import { PLANTS } from "@/lib/data";
import PageClient from "@/components/PageClient";
import ServicesSection from "@/components/ServicesSection";
import FinalCTAWrapper from "@/components/FinalCTAWrapper";
import HeroButtons from "@/components/HeroButtons";

export default function Home() {
  return (
    <PageClient>
      {/* ============ HERO ============ */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="plant plant-1" dangerouslySetInnerHTML={{ __html: PLANTS.monstera }} />
        <div className="plant plant-2" dangerouslySetInnerHTML={{ __html: PLANTS.branch }} />
        <div className="hero-photo-label">[ photo · woman in spa · warm light ]</div>
        <div className="hero-content">
          <div>
            <div className="hero-eyebrow">Santuário de bem-estar · Maputo</div>
            <h1 className="reveal">Estética <em>com</em><br />Propósito.</h1>
            <p className="lede reveal">Cuidar da pele, acalmar a alma, elevar a autoestima. Um espaço onde beleza encontra cura — e cada gesto é um retorno a si mesma.</p>
            <div className="hero-ctas reveal">
              <HeroButtons />
            </div>
          </div>
          <div className="hero-meta">
            <div className="item"><div className="lbl">Experiência</div><div className="val">8 anos cuidando<br />da sua essência</div></div>
            <div className="item"><div className="lbl">Avaliação</div><div className="val">4.9 / 5 · 240 clientes</div></div>
            <div className="item"><div className="lbl">Localização</div><div className="val">Av. Maguiguana<br />R. do Diu, Maputo</div></div>
          </div>
        </div>
        <div className="hero-scroll">
          <span>Descer</span>
          <span className="hero-scroll-line" />
        </div>
      </section>

      {/* ============ BRAND EXPERIENCE ============ */}
      <section className="experience" id="experience">
        <div className="plant plant-1" dangerouslySetInnerHTML={{ __html: PLANTS.vine }} />
        <div className="container">
          <div className="section-head">
            <div>
              <div className="section-eyebrow">A experiência</div>
              <h2 className="section-title reveal">Mais que estética.<br />Uma <em>experiência</em>.</h2>
            </div>
            <div className="right">
              <p className="section-lede reveal">Aqui, cuidar da pele é também acalmar a mente. Cada sessão é uma pausa intencional — silêncio, toque, presença.</p>
            </div>
          </div>
          <div className="experience-grid">
            <div className="exp-photo reveal">
              <span className="corner tl" />
              <span className="corner br" />
              <span className="label">[ photo · therapist hands on shoulder ]</span>
            </div>
            <div>
              <div className="exp-pillars">
                {[
                  { n: "i.", title: "Cura emocional", text: "Antes de tocar a pele, ouvimos. Cada ritual começa por uma conversa íntima — porque a beleza começa de dentro." },
                  { n: "ii.", title: "Conversas profundas", text: "Não somos um salão. Somos um espaço seguro para você desacelerar, desabafar, e voltar inteira." },
                  { n: "iii.", title: "Autocuidado como terapia", text: "Tratamentos clínicos com mãos terapêuticas. O resultado vai além da pele — restaura a relação consigo mesma." },
                ].map((p) => (
                  <div className="pillar reveal" key={p.n}>
                    <div className="pillar-num">{p.n}</div>
                    <div><h4>{p.title}</h4><p>{p.text}</p></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES + PACKAGES (Client Component with cart) */}
      <ServicesSection />

      {/* ============ SIGNATURE ============ */}
      <section className="signature" id="signature">
        <div className="plant plant-1" dangerouslySetInnerHTML={{ __html: PLANTS.branch }} />
        <div className="plant plant-2" dangerouslySetInnerHTML={{ __html: PLANTS.monstera }} />
        <div className="container">
          <div className="section-head">
            <div>
              <div className="section-eyebrow">Rituais signature</div>
              <h2 className="section-title reveal">Cada sessão é um<br />momento de <em>reconexão</em>.</h2>
            </div>
            <div className="right">
              <p className="section-lede reveal">Mais do que estética — um cuidado profundo. Os nossos rituais signature são desenhados para tocar a pele, a respiração, e a alma.</p>
            </div>
          </div>
          <div className="signature-grid">
            <div className="sig-feature dark reveal">
              <span className="quote-mark">&ldquo;</span>
              <div className="step">Ritual 01 · 90 min</div>
              <h3>O Silêncio<br />de Volta a Si</h3>
              <p>Uma jornada lenta de aromaterapia, esfoliação ritual e massagem facial. Termina em silêncio guiado — para que você saia leve, não apenas bonita.</p>
              <div className="ritual">
                <div className="ritual-step"><span className="n">01</span><span className="l">Acolhimento</span></div>
                <div className="ritual-step"><span className="n">02</span><span className="l">Toque</span></div>
                <div className="ritual-step"><span className="n">03</span><span className="l">Silêncio</span></div>
              </div>
            </div>
            <div className="sig-feature reveal">
              <span className="quote-mark">&ldquo;</span>
              <div className="step">Ritual 02 · 75 min</div>
              <h3>Raízes<br />&amp; Recomeço</h3>
              <p>Ritual desenhado para mulheres em fase de transformação. Banho aromático, escalda-pés terapêutico e massagem de mãos com leitura de intenção.</p>
              <div className="ritual">
                <div className="ritual-step"><span className="n">01</span><span className="l">Banho</span></div>
                <div className="ritual-step"><span className="n">02</span><span className="l">Toque</span></div>
                <div className="ritual-step"><span className="n">03</span><span className="l">Intenção</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="testimonials" id="testimonials">
        <div className="plant plant-1" dangerouslySetInnerHTML={{ __html: PLANTS.branch }} />
        <div className="plant plant-2" dangerouslySetInnerHTML={{ __html: PLANTS.branch }} />
        <div className="container">
          <div className="section-head">
            <div>
              <div className="section-eyebrow">Histórias</div>
              <h2 className="section-title reveal">O que muda<br />vai além da <em>pele</em>.</h2>
            </div>
            <div className="right">
              <p className="section-lede reveal">As nossas clientes voltam. Não apenas pelos resultados, mas pelo lugar que encontraram dentro de si.</p>
            </div>
          </div>
          <div className="testi-grid">
            {[
              { quote: "Saí de lá outra mulher. Não foi a pele — foi como me senti vista. Há meses que não chorava de leveza.", name: "Hortência M.", meta: "Maputo · cliente desde 2024" },
              { quote: "Vim pela limpeza de pele. Voltei para ouvir o silêncio. Agora venho todo o mês — é o meu refúgio.", name: "Telma C.", meta: "Matola · cliente desde 2023" },
              { quote: "Aqui não me trataram como cliente. Trataram-me como mulher inteira. A diferença está em tudo — incluindo na pele.", name: "Iolanda S.", meta: "Maputo · cliente desde 2025" },
            ].map((t) => (
              <div className="testi-card reveal" key={t.name}>
                <div className="testi-stars">
                  {Array(5).fill(0).map((_, i) => (
                    <svg key={i} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 7 7 .5-5.5 4.5L18 22l-6-4-6 4 1.5-8L2 9.5 9 9z" /></svg>
                  ))}
                </div>
                <p className="testi-quote">{t.quote}</p>
                <div className="testi-author">
                  <div className="testi-avatar" />
                  <div>
                    <div className="name">{t.name}</div>
                    <div className="meta">{t.meta}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <FinalCTAWrapper />

      {/* ============ FOOTER ============ */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <a href="#" className="brand">
                <span className="brand-mark">
                  <Image src="/logo.png" alt="Skin & Soul" width={46} height={46} style={{ width: "120%", height: "120%", objectFit: "cover", objectPosition: "center 35%" }} />
                </span>
                <span className="brand-text">
                  <span className="name">Skin &amp; Soul</span>
                  <span className="tag">Estética com propósito</span>
                </span>
              </a>
              <p className="footer-tag">Beleza encontra cura. Um santuário de cuidado em Maputo.</p>
              <div className="footer-contact">
                <div className="row">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                  <span>Av. Maguiguana, R. do Diu<br />Maputo · Moçambique</span>
                </div>
                <div className="row">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3.1-8.7A2 2 0 014 2h3a2 2 0 012 1.7 12.8 12.8 0 00.7 2.8 2 2 0 01-.5 2.1L8 9.8a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.5 12.8 12.8 0 002.8.7 2 2 0 011.8 2z" /></svg>
                  <span>+258 84 000 0000</span>
                </div>
                <div className="row">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="6" width="20" height="14" rx="2" /><path d="M2 8l10 6 10-6" /></svg>
                  <span>geral@skinandsoul.co.mz</span>
                </div>
              </div>
            </div>
            <div>
              <h5>Navegar</h5>
              <ul>
                <li><a href="#experience">A experiência</a></li>
                <li><a href="#services">Serviços</a></li>
                <li><a href="#signature">Rituais</a></li>
                <li><a href="#packages">Pacotes</a></li>
                <li><a href="#testimonials">Histórias</a></li>
              </ul>
            </div>
            <div>
              <h5>Tratamentos</h5>
              <ul>
                <li><a href="#services">Faciais</a></li>
                <li><a href="#services">Corporais</a></li>
                <li><a href="#services">Depilação</a></li>
                <li><a href="#services">Pestanas</a></li>
                <li><a href="#services">Tratamentos especiais</a></li>
              </ul>
            </div>
            <div>
              <h5>Horário</h5>
              <ul>
                <li>Seg – Sex · 09h00 – 19h00</li>
                <li>Sábado · 09h00 – 16h00</li>
                <li>Domingo · fechado</li>
                <li style={{ marginTop: 14 }}><a href="/dashboard" className="footer-dash">Painel interno</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 Skin &amp; Soul · Todos os direitos reservados</span>
            <div className="links">
              <a href="#">Privacidade</a>
              <a href="#">Termos</a>
              <a href="#">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </PageClient>
  );
}
