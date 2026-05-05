// ============ SKIN & SOUL · APP ============
const STORE_KEY = 'skinsoul_v1';
const APPT_KEY  = 'skinsoul_appts_v1';
const WHATSAPP_NUMBER = '258840000000'; // change to real

const fmt = n => n.toLocaleString('pt-PT').replace(/,/g,' ') + ' MT';

const state = (() => {
  const saved = JSON.parse(localStorage.getItem(STORE_KEY) || '{}');
  return {
    cart: saved.cart || [],     // [{id, qty}]
    activeCat: 'all',
  };
})();
const persist = () => localStorage.setItem(STORE_KEY, JSON.stringify({cart: state.cart}));

// ----- helpers
function svc(id){ return SERVICES.find(s=>s.id===id) || PACKAGES.find(p=>p.id===id); }
function cartCount(){ return state.cart.reduce((a,c)=>a+c.qty,0); }
function cartTotal(){ return state.cart.reduce((a,c)=>a + svc(c.id).price * c.qty, 0); }

function toast(msg){
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = `${ICONS.check}<span>${msg}</span>`;
  document.body.appendChild(t);
  setTimeout(()=>{ t.style.opacity='0'; t.style.transform='translateY(20px)'; t.style.transition='all .3s';}, 2400);
  setTimeout(()=>t.remove(), 2800);
}

// ============ CATEGORIES + SERVICES RENDER ============
function renderTabs(){
  const el = document.getElementById('catTabs');
  el.innerHTML = CATEGORIES.map(c => `
    <button class="cat-tab ${state.activeCat===c.id?'active':''}" data-id="${c.id}">${c.name}</button>
  `).join('');
  el.querySelectorAll('.cat-tab').forEach(b => {
    b.onclick = () => { state.activeCat = b.dataset.id; renderTabs(); renderServices(); };
  });
}

function renderServices(){
  const el = document.getElementById('servicesGrid');
  const list = state.activeCat==='all' ? SERVICES : SERVICES.filter(s=>s.cat===state.activeCat);
  el.innerHTML = list.map(s => `
    <article class="svc-card">
      <div class="svc-icon">${ICONS[s.icon]}</div>
      <div class="svc-cat">${s.catLabel}</div>
      <h3>${s.name}</h3>
      <p>${s.desc}</p>
      <div class="svc-meta">
        <div class="svc-price"><span class="from">a partir de</span>${fmt(s.price)}</div>
        <div class="svc-duration">${ICONS.clock}${s.duration} min</div>
      </div>
      <button class="svc-add" onclick="addToCart('${s.id}')">${ICONS.plus} Adicionar ao ritual</button>
    </article>
  `).join('');
}

// ============ PACKAGES RENDER ============
function renderPackages(){
  const el = document.getElementById('packagesGrid');
  el.innerHTML = PACKAGES.map(p => `
    <article class="pkg-card ${p.featured?'featured':''}">
      ${p.tag ? `<span class="pkg-tag">${p.tag}</span>` : ''}
      <div class="pkg-photo"><span class="label">[ photo · ${p.name} ]</span></div>
      <div class="pkg-body">
        <div class="pkg-cat">${p.cat} · ${p.duration}</div>
        <h3>${p.name}</h3>
        <p class="pkg-desc">${p.desc}</p>
        <ul class="pkg-includes">
          ${p.includes.map(i => `<li>${ICONS.check}<span>${i}</span></li>`).join('')}
        </ul>
        <div class="pkg-foot">
          <div class="pkg-price-row">
            <div class="pkg-price"><span class="currency">MT</span>${p.price.toLocaleString('pt-PT').replace(/,/g,' ')}</div>
            ${p.originalPrice ? `<div class="pkg-original">${fmt(p.originalPrice)}</div>` : ''}
          </div>
          <button class="pkg-add" onclick="addToCart('${p.id}')">${ICONS.plus} Adicionar ao ritual</button>
        </div>
      </div>
    </article>
  `).join('');
}

// ============ CART ============
function addToCart(id){
  const item = state.cart.find(c=>c.id===id);
  if(item) item.qty++;
  else state.cart.push({id, qty:1});
  persist(); updateBadge();
  const s = svc(id);
  toast(`${s.name} adicionado ao seu ritual`);
}
function removeFromCart(id){
  state.cart = state.cart.filter(c=>c.id!==id);
  persist(); updateBadge(); renderCart();
}
function changeQty(id, delta){
  const item = state.cart.find(c=>c.id===id);
  if(!item) return;
  item.qty += delta;
  if(item.qty<1) state.cart = state.cart.filter(c=>c.id!==id);
  persist(); updateBadge(); renderCart();
}
function updateBadge(){
  const b = document.getElementById('cartBadge');
  const c = cartCount();
  b.style.display = c>0?'grid':'none';
  b.textContent = c;
}
function openCart(){ renderCart(); document.getElementById('cartModal').classList.add('open'); }
function closeCart(){ document.getElementById('cartModal').classList.remove('open'); }
function renderCart(){
  const body = document.getElementById('cartBody');
  const foot = document.getElementById('cartFoot');
  if(state.cart.length===0){
    body.innerHTML = `
      <div class="cart-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M3 4h2l2.5 12h11l2-9H6"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/></svg>
        <h4>O seu ritual aguarda</h4>
        <p>Adicione tratamentos para começar a desenhar a sua sessão.</p>
      </div>`;
    foot.style.display = 'none';
    return;
  }
  body.innerHTML = `<div class="cart-list">${state.cart.map(c => {
    const s = svc(c.id);
    const isPkg = !!s.includes;
    return `
      <div class="cart-item">
        <div class="info">
          <div class="cat">${isPkg ? s.cat : s.catLabel}</div>
          <h4>${s.name}</h4>
          <div class="meta">
            ${!isPkg ? `<span>${ICONS.clock}${s.duration} min</span>` : `<span>${s.duration}</span>`}
          </div>
        </div>
        <div class="actions">
          <div class="price">${fmt(s.price * c.qty)}</div>
          <div class="qty">
            <button onclick="changeQty('${c.id}',-1)" aria-label="Menos">${ICONS.minus}</button>
            <span class="n">${c.qty}</span>
            <button onclick="changeQty('${c.id}',1)" aria-label="Mais">${ICONS.plus}</button>
          </div>
          <button class="remove" onclick="removeFromCart('${c.id}')">Remover</button>
        </div>
      </div>`;
  }).join('')}</div>`;
  document.getElementById('cartTotal').textContent = fmt(cartTotal());
  foot.style.display = 'flex';
}

// ============ BOOKING ============
let booking = { step:1, serviceId:null, notes:'', date:null, time:null };

function openBooking(prefServiceId){
  // populate select
  const sel = document.getElementById('bookService');
  sel.innerHTML = '<option value="">— Selecione um tratamento —</option>' +
    '<optgroup label="Tratamentos">' +
    SERVICES.map(s => `<option value="${s.id}">${s.name} · ${fmt(s.price)} · ${s.duration}min</option>`).join('') +
    '</optgroup>' +
    '<optgroup label="Pacotes">' +
    PACKAGES.map(p => `<option value="${p.id}">${p.name} · ${fmt(p.price)} · ${p.duration}</option>`).join('') +
    '</optgroup>';
  if(prefServiceId) sel.value = prefServiceId;
  // if cart has items, default first to it
  else if(state.cart.length) sel.value = state.cart[0].id;
  booking = { step:1, serviceId: sel.value || null, notes:'', date:null, time:null };
  document.getElementById('bookModal').classList.add('open');
  renderBookStep();
}
function closeBooking(){ document.getElementById('bookModal').classList.remove('open'); }

function renderBookStep(){
  document.querySelectorAll('.book-step').forEach(s => s.classList.toggle('active', +s.dataset.step===booking.step));
  document.querySelectorAll('.book-stepper .step').forEach(s => {
    const n = +s.dataset.s;
    s.classList.toggle('done', n<booking.step);
    s.classList.toggle('current', n===booking.step);
  });
  document.getElementById('bookBack').style.visibility = booking.step===1?'hidden':'visible';
  const next = document.getElementById('bookNext');
  next.innerHTML = booking.step===4
    ? `Confirmar via WhatsApp <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M17.6 14.2c-.3-.2-1.8-.9-2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.5-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.4.4-.5l.3-.4c.1-.2 0-.3 0-.5-.1-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.2 3.3 5.3 4.6.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4l-.5-.7zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.2-1.3c1.4.8 3 1.3 4.8 1.3 5.5 0 10-4.5 10-10S17.5 2 12 2z"/></svg>`
    : `Continuar <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`;

  if(booking.step===2) renderDates();
  if(booking.step===3) renderTimes();
  if(booking.step===4) renderSummary();
}

function renderDates(){
  const el = document.getElementById('dateGrid');
  const today = new Date(); today.setHours(0,0,0,0);
  const days = [];
  for(let i=0;i<21;i++){
    const d = new Date(today); d.setDate(today.getDate()+i);
    days.push(d);
  }
  const dows = ['D','S','T','Q','Q','S','S'];
  el.innerHTML = days.map(d => {
    const dow = d.getDay();
    const disabled = dow===0; // Sunday closed
    const iso = d.toISOString().slice(0,10);
    const sel = booking.date===iso?'selected':'';
    return `<button class="date-cell ${disabled?'disabled':''} ${sel}" ${disabled?'disabled':`onclick="selectDate('${iso}')"`}>
      <span class="dow">${dows[dow]}</span><span class="d">${d.getDate()}</span>
    </button>`;
  }).join('');
}
function selectDate(iso){ booking.date = iso; booking.time=null; renderDates(); }

function renderTimes(){
  const el = document.getElementById('timeGrid');
  const slots = [];
  const d = new Date(booking.date);
  const sat = d.getDay()===6;
  const start = 9;
  const end = sat?16:19;
  for(let h=start; h<end; h++){ slots.push(`${String(h).padStart(2,'0')}:00`); slots.push(`${String(h).padStart(2,'0')}:30`); }
  // pseudo-random "taken" based on date
  const seed = booking.date.split('-').reduce((a,b)=>a+parseInt(b),0);
  el.innerHTML = slots.map((t,i) => {
    const taken = (i*7 + seed) % 9 < 3;
    const sel = booking.time===t?'selected':'';
    return `<button class="time-cell ${taken?'disabled':''} ${sel}" ${taken?'disabled':`onclick="selectTime('${t}')"`}>${t}</button>`;
  }).join('');
}
function selectTime(t){ booking.time=t; renderTimes(); }

function renderSummary(){
  const s = svc(booking.serviceId);
  const date = new Date(booking.date);
  const dStr = date.toLocaleDateString('pt-PT', {weekday:'long', day:'numeric', month:'long', year:'numeric'});
  document.getElementById('bookSummary').innerHTML = `
    <h4>Resumo da reserva</h4>
    <div class="summary-row"><span class="l">Ritual</span><span class="v">${s.name}</span></div>
    <div class="summary-row"><span class="l">Data</span><span class="v">${dStr}</span></div>
    <div class="summary-row"><span class="l">Hora</span><span class="v">${booking.time}</span></div>
    <div class="summary-row"><span class="l">Duração</span><span class="v">${s.duration} ${typeof s.duration==='number'?'min':''}</span></div>
    <div class="summary-row total"><span class="l">Total</span><span class="v">${fmt(s.price)}</span></div>
  `;
}

function bookBack(){ if(booking.step>1){ booking.step--; renderBookStep(); } }
function bookNext(){
  if(booking.step===1){
    booking.serviceId = document.getElementById('bookService').value;
    booking.notes = document.getElementById('bookNotes').value.trim();
    if(!booking.serviceId){ alert('Por favor escolha um tratamento.'); return; }
  }
  if(booking.step===2 && !booking.date){ alert('Escolha uma data disponível.'); return; }
  if(booking.step===3 && !booking.time){ alert('Escolha um horário disponível.'); return; }
  if(booking.step===4){
    const name = document.getElementById('bookName').value.trim();
    const phone = document.getElementById('bookPhone').value.trim();
    if(!name || !phone){ alert('Preencha nome e telefone.'); return; }
    finalizeBooking({name, phone, email: document.getElementById('bookEmail').value.trim()});
    return;
  }
  booking.step++;
  renderBookStep();
}

function finalizeBooking(client){
  const s = svc(booking.serviceId);
  // store appointment locally so dashboard can show it
  const appts = JSON.parse(localStorage.getItem(APPT_KEY) || '[]');
  const appt = {
    id: 'A'+Date.now().toString(36).toUpperCase(),
    serviceId: booking.serviceId,
    serviceName: s.name,
    price: s.price,
    duration: s.duration,
    date: booking.date,
    time: booking.time,
    client,
    notes: booking.notes,
    status: 'pending',
    createdAt: Date.now(),
  };
  appts.unshift(appt);
  localStorage.setItem(APPT_KEY, JSON.stringify(appts));

  const date = new Date(booking.date);
  const dStr = date.toLocaleDateString('pt-PT', {weekday:'long', day:'numeric', month:'long'});
  const msg = encodeURIComponent(
`Olá Skin & Soul. Gostaria de confirmar a minha reserva:

• Ritual: ${s.name}
• Data: ${dStr} às ${booking.time}
• Duração: ${s.duration}${typeof s.duration==='number'?' min':''}
• Total: ${fmt(s.price)}

Nome: ${client.name}
Telefone: ${client.phone}${client.email?`\nEmail: ${client.email}`:''}${booking.notes?`\n\nNotas: ${booking.notes}`:''}

Código: ${appt.id}`
  );
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
  closeBooking();
  toast('Reserva enviada para WhatsApp');
}

// ============ WHATSAPP CHECKOUT FROM CART ============
function checkoutWhatsApp(simple){
  if(simple || state.cart.length===0){
    const msg = encodeURIComponent(`Olá Skin & Soul. Gostaria de saber mais sobre os vossos rituais e marcar uma sessão.`);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
    return;
  }
  const lines = state.cart.map(c => {
    const s = svc(c.id);
    return `• ${s.name} × ${c.qty} — ${fmt(s.price * c.qty)}`;
  }).join('\n');
  const msg = encodeURIComponent(
`Olá Skin & Soul. Gostaria de reservar:

${lines}

Total: ${fmt(cartTotal())}

Aguardo confirmação.`
  );
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
}

// ============ NAV SCROLL ============
window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 30);
});

// ============ REVEAL ============
const io = new IntersectionObserver(es => {
  es.forEach(e => { if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target); } });
}, {threshold:.12});
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ============ PLANTS ============
document.querySelectorAll('[data-plant]').forEach(el => {
  const k = el.dataset.plant;
  if(PLANTS[k]) el.innerHTML = PLANTS[k];
});

// ============ INIT ============
renderTabs();
renderServices();
renderPackages();
updateBadge();
