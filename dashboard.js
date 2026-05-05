// ============ DASHBOARD ============
const APPT_KEY = 'skinsoul_appts_v1';
const WHATSAPP_NUMBER = '258840000000';

const fmt = n => (n||0).toLocaleString('pt-PT').replace(/,/g,' ') + ' MT';
function svc(id){ return SERVICES.find(s=>s.id===id) || PACKAGES.find(p=>p.id===id); }
function loadAppts(){ return JSON.parse(localStorage.getItem(APPT_KEY) || '[]'); }
function saveAppts(a){ localStorage.setItem(APPT_KEY, JSON.stringify(a)); }

let state = { view: 'overview', day: 0, filter: 'all', svcCat:'all', search:'' };

// ===== Demo seed =====
function seedDemo(){
  if(!confirm('Carregar dados de demonstração? (substitui reservas existentes)')) return;
  const today = new Date(); today.setHours(0,0,0,0);
  const iso = d => d.toISOString().slice(0,10);
  const mk = (offset, time, sid, name, phone, status, notes='') => {
    const d = new Date(today); d.setDate(today.getDate()+offset);
    const s = svc(sid);
    return {
      id:'A'+Math.random().toString(36).slice(2,8).toUpperCase(),
      serviceId:sid, serviceName:s.name, price:s.price, duration:s.duration,
      date:iso(d), time, status, notes,
      client:{name, phone, email:''},
      createdAt: Date.now()-Math.random()*1e9,
    };
  };
  const demos = [
    mk(0, '09:30','f-vc','Hortência Macuácua','+258 84 123 4567','confirmed'),
    mk(0, '11:00','b-mas','Telma Cossa','+258 82 987 6543','confirmed','Prefere óleo de lavanda'),
    mk(0, '14:00','dp-ss','Iolanda Sitoe','+258 86 555 1234','pending'),
    mk(0, '16:30','l-4d','Ana Mahumana','+258 84 333 7777','confirmed'),
    mk(1, '10:00','pk-pls','Carla Nhantumbo','+258 82 444 5555','pending','Primeira sessão'),
    mk(1, '13:00','f-ac','Salomé Mondlane','+258 84 222 1111','confirmed'),
    mk(1, '15:30','c-ax1','Bélinda Tovela','+258 86 777 8888','confirmed'),
    mk(2, '09:00','b-dre','Luísa Khosa','+258 84 666 0001','pending'),
    mk(2, '11:30','dp-vc','Mariza Cumbe','+258 82 121 2121','pending'),
    mk(2, '14:00','pk-ax6','Tânia Jossias','+258 84 909 0909','confirmed','Sessão 3 de 6'),
    mk(-1,'10:00','f-hg','Eunice Massingue','+258 84 010 1010','done'),
    mk(-1,'13:00','b-mas','Domingas Sive','+258 82 020 2020','done'),
    mk(-2,'15:00','pk-em','Florinda Xavier','+258 84 030 3030','done'),
    mk(-3,'11:00','f-re','Helena Sumbane','+258 82 040 4040','done'),
    mk(-3,'14:30','l-cl','Marta Bilale','+258 84 050 5050','done'),
    mk(-5,'10:30','dp-bas','Rosa Manjate','+258 82 060 6060','done'),
    mk(-7,'12:00','pk-vi4','Carmen Macul','+258 84 070 7070','done','Sessão 1 de 4'),
    mk(-10,'09:00','f-cs','Sandra Mucavele','+258 82 080 8080','done'),
  ];
  saveAppts(demos);
  renderAll();
}

// ===== Routing =====
document.querySelectorAll('.nav-item[data-view]').forEach(b => {
  b.onclick = (e) => {
    e.preventDefault();
    document.querySelectorAll('.nav-item[data-view]').forEach(n=>n.classList.remove('active'));
    b.classList.add('active');
    state.view = b.dataset.view;
    document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active', v.dataset.view===state.view));
    renderAll();
  };
});

// ===== Date helpers =====
const todayStr = () => new Date().toISOString().slice(0,10);
function offsetDate(off){ const d=new Date(); d.setDate(d.getDate()+off); return d.toISOString().slice(0,10); }

// ===== Overview =====
function renderOverview(){
  const appts = loadAppts();
  const today = todayStr();

  // Today label
  const dLbl = new Date().toLocaleDateString('pt-PT',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
  document.getElementById('todayLabel').textContent = dLbl.charAt(0).toUpperCase()+dLbl.slice(1);

  // KPIs
  const todayAppts = appts.filter(a=>a.date===today);
  const weekAppts = appts.filter(a => {
    const d = new Date(a.date), now = new Date();
    const diff = (d - now)/(1000*60*60*24);
    return diff >= -1 && diff <= 7;
  });
  const monthAppts = appts.filter(a => {
    const d = new Date(a.date), now = new Date();
    return d.getMonth()===now.getMonth() && d.getFullYear()===now.getFullYear();
  });
  const monthRev = monthAppts.filter(a=>a.status!=='cancelled').reduce((s,a)=>s+a.price,0);
  const uniqueClients = new Set(appts.filter(a => {
    const d = new Date(a.date); const now=new Date();
    return (now-d)/(1000*60*60*24) < 30;
  }).map(a=>a.client.phone)).size;

  document.getElementById('kpiToday').textContent = todayAppts.length;
  document.getElementById('kpiWeek').textContent = weekAppts.length;
  document.getElementById('kpiRevenue').textContent = fmt(monthRev);
  document.getElementById('kpiClients').textContent = uniqueClients;
  document.getElementById('apptBadge').textContent = appts.filter(a=>a.status==='pending').length;

  // Schedule
  const dayDate = offsetDate(state.day);
  const daySchedule = appts.filter(a=>a.date===dayDate).sort((a,b)=>a.time.localeCompare(b.time));
  const slots = [];
  const sat = new Date(dayDate).getDay()===6;
  for(let h=9;h<(sat?16:19);h++){ slots.push(`${String(h).padStart(2,'0')}:00`); slots.push(`${String(h).padStart(2,'0')}:30`); }
  const sched = document.getElementById('schedule');
  sched.innerHTML = slots.map(t => {
    const appt = daySchedule.find(a => a.time === t);
    if(!appt) return `<div class="tl-row"><span class="tl-time">${t}</span><div class="tl-card empty">— livre —</div></div>`;
    return `<div class="tl-row">
      <span class="tl-time">${t}</span>
      <div class="tl-card" onclick="openApptModal('${appt.id}')" style="cursor:pointer">
        <div>
          <div class="name">${appt.client.name}</div>
          <div class="meta">${appt.serviceName} · ${appt.duration}${typeof appt.duration==='number'?' min':''}</div>
        </div>
        <span class="stat stat-${appt.status}">${statLabel(appt.status)}</span>
      </div>
    </div>`;
  }).join('');

  // Top services (last 30d)
  const recent = appts.filter(a => (new Date() - new Date(a.date))/(1000*60*60*24) < 30 && a.status!=='cancelled');
  const tally = {};
  recent.forEach(a => { tally[a.serviceId] = (tally[a.serviceId]||0)+1; });
  const top = Object.entries(tally).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const max = top.length ? top[0][1] : 1;
  document.getElementById('topList').innerHTML = top.length ? top.map(([id,n],i) => {
    const s = svc(id);
    return `<div class="top-item">
      <div class="top-rank">${String(i+1).padStart(2,'0')}</div>
      <div class="top-info">
        <div class="nm">${s.name}</div>
        <div class="ct">${s.catLabel || s.cat}</div>
        <div class="top-bar"><span style="width:${(n/max)*100}%"></span></div>
      </div>
      <div class="top-num">${n}</div>
    </div>`;
  }).join('') : '<div class="empty">Sem dados ainda. Carregue a demo para ver.</div>';
  document.getElementById('topTotal').textContent = `${recent.length} sessões`;

  // Recent table
  const search = (document.getElementById('recentSearch')?.value || '').toLowerCase();
  const recents = appts.slice().sort((a,b)=>b.createdAt-a.createdAt).filter(a => {
    if(!search) return true;
    return a.client.name.toLowerCase().includes(search) || a.serviceName.toLowerCase().includes(search);
  }).slice(0,8);
  const rt = document.getElementById('recentTbody');
  rt.innerHTML = recents.length ? recents.map(a => `
    <tr>
      <td><div class="nm">${a.client.name}</div><div class="sub">${a.client.phone}</div></td>
      <td><div class="nm" style="font-size:14px">${a.serviceName}</div><div class="sub">${a.duration}${typeof a.duration==='number'?' min':''}</div></td>
      <td class="tbl-mobile-hide"><div class="nm" style="font-size:14px">${formatDate(a.date)}</div><div class="sub">${a.time}</div></td>
      <td class="tbl-mobile-hide"><span class="stat stat-${a.status}">${statLabel(a.status)}</span></td>
      <td><span class="price">${fmt(a.price)}</span></td>
      <td><div class="tbl-actions">
        <button class="icon-act" title="Detalhes" onclick="openApptModal('${a.id}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9"/><path d="M12 8v.01M12 11v5"/></svg></button>
        <button class="icon-act wa" title="WhatsApp" onclick="waAppt('${a.id}')"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.6 14.2c-.3-.2-1.8-.9-2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.5-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.4.4-.5l.3-.4c.1-.2 0-.3 0-.5-.1-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.2 3.3 5.3 4.6.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4l-.5-.7zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.2-1.3c1.4.8 3 1.3 4.8 1.3 5.5 0 10-4.5 10-10S17.5 2 12 2z"/></svg></button>
      </div></td>
    </tr>
  `).join('') : `<tr><td colspan="6"><div class="empty">Sem reservas. Clique em <b>Carregar demo</b> ou crie uma nova.</div></td></tr>`;
}

function statLabel(s){ return {pending:'Pendente',confirmed:'Confirmado',done:'Concluído',cancelled:'Cancelado'}[s]||s }
function formatDate(iso){
  const d = new Date(iso);
  return d.toLocaleDateString('pt-PT',{day:'numeric',month:'short'});
}

// Day tabs
document.querySelectorAll('[data-day]').forEach(b => {
  b.onclick = () => {
    document.querySelectorAll('[data-day]').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    state.day = +b.dataset.day;
    renderOverview();
  };
});
document.getElementById('recentSearch')?.addEventListener('input', renderOverview);

// ===== Appointments view =====
function renderAppts(){
  const appts = loadAppts().slice().sort((a,b)=>{
    const dc = b.date.localeCompare(a.date);
    return dc !== 0 ? dc : b.time.localeCompare(a.time);
  });
  const search = (document.getElementById('apptSearch')?.value || '').toLowerCase();
  const filtered = appts.filter(a => {
    if(state.filter !== 'all' && a.status !== state.filter) return false;
    if(search && !(a.client.name.toLowerCase().includes(search) || a.serviceName.toLowerCase().includes(search) || a.id.toLowerCase().includes(search))) return false;
    return true;
  });
  const tb = document.getElementById('apptTbody');
  tb.innerHTML = filtered.length ? filtered.map(a => `
    <tr>
      <td><span class="sub" style="font-family:var(--mono);font-size:12px;color:var(--emerald);letter-spacing:.04em">${a.id}</span></td>
      <td><div class="nm">${a.client.name}</div><div class="sub">${a.client.phone}</div></td>
      <td><div class="nm" style="font-size:14px">${a.serviceName}</div></td>
      <td><div class="nm" style="font-size:14px">${formatDate(a.date)}</div><div class="sub">${a.time}</div></td>
      <td><span class="stat stat-${a.status}">${statLabel(a.status)}</span></td>
      <td><span class="price">${fmt(a.price)}</span></td>
      <td><div class="tbl-actions">
        <button class="icon-act" title="Detalhes" onclick="openApptModal('${a.id}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg></button>
        <button class="icon-act wa" title="WhatsApp" onclick="waAppt('${a.id}')"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.6 14.2c-.3-.2-1.8-.9-2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.5-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.4.4-.5l.3-.4c.1-.2 0-.3 0-.5-.1-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.2 3.3 5.3 4.6.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4l-.5-.7zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.2-1.3c1.4.8 3 1.3 4.8 1.3 5.5 0 10-4.5 10-10S17.5 2 12 2z"/></svg></button>
        <button class="icon-act danger" title="Cancelar" onclick="cancelAppt('${a.id}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 6l12 12M6 18L18 6"/></svg></button>
      </div></td>
    </tr>
  `).join('') : `<tr><td colspan="7"><div class="empty">Sem reservas para este filtro.</div></td></tr>`;
}
document.querySelectorAll('[data-filter]').forEach(b => {
  b.onclick = () => {
    document.querySelectorAll('[data-filter]').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    state.filter = b.dataset.filter;
    renderAppts();
  };
});
document.getElementById('apptSearch')?.addEventListener('input', renderAppts);

// ===== Clients =====
function renderClients(){
  const appts = loadAppts();
  const map = {};
  appts.forEach(a => {
    const k = a.client.phone || a.client.name;
    if(!map[k]) map[k] = { ...a.client, count:0, total:0, last:a.date };
    map[k].count++;
    if(a.status!=='cancelled') map[k].total += a.price;
    if(a.date > map[k].last) map[k].last = a.date;
  });
  const list = Object.values(map).sort((a,b)=>b.total-a.total);
  const grid = document.getElementById('clientGrid');
  grid.innerHTML = list.length ? list.map(c => `
    <div class="client-card">
      <div class="top">
        <div class="avatar">${c.name.split(' ').map(p=>p[0]).slice(0,2).join('')}</div>
        <div>
          <div class="nm">${c.name}</div>
          <div class="ph">${c.phone||'—'}</div>
        </div>
      </div>
      <div class="client-meta">
        <div><div class="l">Sessões</div><div class="v">${c.count}</div></div>
        <div><div class="l">Investido</div><div class="v">${fmt(c.total)}</div></div>
        <div><div class="l">Última visita</div><div class="v" style="font-size:13px">${formatDate(c.last)}</div></div>
        <div><div class="l">Estado</div><div class="v" style="font-size:13px;color:var(--sage)">Activa</div></div>
      </div>
    </div>
  `).join('') : `<div class="empty" style="grid-column:1/-1">Sem clientes ainda.</div>`;
}

// ===== Services view =====
function renderSvcCats(){
  const cats = [{id:'all',name:'Todos'},{id:'facial',name:'Faciais'},{id:'derm',name:'Dermaplaning'},{id:'body',name:'Corporais'},{id:'exf',name:'Esfoliação'},{id:'depil',name:'Depilação'},{id:'bright',name:'Clareamento'},{id:'lash',name:'Pestanas'},{id:'pkg',name:'Pacotes'}];
  const el = document.getElementById('svcCats');
  el.innerHTML = cats.map(c => `<button class="${state.svcCat===c.id?'active':''}" data-c="${c.id}">${c.name}</button>`).join('');
  el.querySelectorAll('button').forEach(b => b.onclick = () => { state.svcCat = b.dataset.c; renderSvcCats(); renderSvc(); });
}
function renderSvc(){
  let list;
  if(state.svcCat==='all') list = [...SERVICES, ...PACKAGES.map(p => ({...p, catLabel:p.cat, duration:p.duration}))];
  else if(state.svcCat==='pkg') list = PACKAGES.map(p => ({...p, catLabel:p.cat, duration:p.duration}));
  else list = SERVICES.filter(s=>s.cat===state.svcCat);
  document.getElementById('svcTbody').innerHTML = list.map(s => `
    <tr>
      <td><div class="nm">${s.name}</div><div class="sub">${s.desc||''}</div></td>
      <td><div class="sub" style="font-size:12px">${s.catLabel}</div></td>
      <td><div class="sub" style="font-size:13px">${s.duration}${typeof s.duration==='number'?' min':''}</div></td>
      <td><span class="price">${fmt(s.price)}</span></td>
    </tr>
  `).join('');
}

// ===== Finance =====
function renderFinance(){
  const appts = loadAppts();
  const now = new Date();
  const month = appts.filter(a => {
    const d = new Date(a.date);
    return d.getMonth()===now.getMonth() && d.getFullYear()===now.getFullYear();
  });
  const realized = month.filter(a=>a.status==='done' || a.status==='confirmed');
  const projected = month.filter(a=>a.status!=='cancelled');
  const monthRev = realized.reduce((s,a)=>s+a.price,0);
  const projectedRev = projected.reduce((s,a)=>s+a.price,0);
  const avg = realized.length ? monthRev/realized.length : 0;
  document.getElementById('finMonth').textContent = fmt(monthRev);
  document.getElementById('finProjected').textContent = fmt(projectedRev);
  document.getElementById('finAvg').textContent = fmt(Math.round(avg));
  document.getElementById('finSessions').textContent = realized.length;

  // by category
  const catTally = {};
  realized.forEach(a => {
    const s = svc(a.serviceId);
    const cat = s.catLabel ? (s.catLabel.split(' · ')[0]||s.catLabel) : (s.cat||'Pacote');
    if(!catTally[cat]) catTally[cat]={count:0,total:0};
    catTally[cat].count++;
    catTally[cat].total += a.price;
  });
  const total = Object.values(catTally).reduce((s,c)=>s+c.total,0) || 1;
  const tb = document.getElementById('finTbody');
  const rows = Object.entries(catTally).sort((a,b)=>b[1].total-a[1].total);
  tb.innerHTML = rows.length ? rows.map(([cat,d]) => `
    <tr>
      <td><div class="nm" style="font-size:15px">${cat}</div></td>
      <td>${d.count}</td>
      <td><span class="price">${fmt(d.total)}</span></td>
      <td>
        <div style="display:flex;align-items:center;gap:10px">
          <div class="top-bar" style="flex:1;max-width:160px"><span style="width:${(d.total/total)*100}%"></span></div>
          <span style="font-family:var(--mono);font-size:12px;color:var(--muted)">${Math.round((d.total/total)*100)}%</span>
        </div>
      </td>
    </tr>
  `).join('') : `<tr><td colspan="4"><div class="empty">Sem dados.</div></td></tr>`;
}

// ===== Modals =====
function openApptModal(id){
  const a = loadAppts().find(x=>x.id===id);
  if(!a) return;
  document.getElementById('apptMTitle').textContent = `Reserva · ${a.id}`;
  document.getElementById('apptMBody').innerHTML = `
    <div class="detail-row"><span class="k">Cliente</span><span class="v">${a.client.name}</span></div>
    <div class="detail-row"><span class="k">Telefone</span><span class="v" style="font-family:var(--mono);font-size:14px">${a.client.phone||'—'}</span></div>
    ${a.client.email?`<div class="detail-row"><span class="k">Email</span><span class="v" style="font-size:14px">${a.client.email}</span></div>`:''}
    <div class="detail-row"><span class="k">Ritual</span><span class="v">${a.serviceName}</span></div>
    <div class="detail-row"><span class="k">Data</span><span class="v">${formatDate(a.date)} · ${a.time}</span></div>
    <div class="detail-row"><span class="k">Duração</span><span class="v">${a.duration}${typeof a.duration==='number'?' min':''}</span></div>
    <div class="detail-row"><span class="k">Preço</span><span class="v">${fmt(a.price)}</span></div>
    <div class="detail-row"><span class="k">Estado</span><span class="v"><span class="stat stat-${a.status}">${statLabel(a.status)}</span></span></div>
    ${a.notes?`<div class="detail-row"><span class="k">Notas</span><span class="v" style="font-size:14px;font-family:var(--sans);font-style:italic;color:var(--muted)">"${a.notes}"</span></div>`:''}
  `;
  const foot = document.getElementById('apptMFoot');
  foot.innerHTML = `
    <button class="btn btn-light" onclick="closeApptModal()">Fechar</button>
    <button class="btn btn-wa" onclick="waAppt('${a.id}')">
      <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13"><path d="M17.6 14.2c-.3-.2-1.8-.9-2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.5-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.4.4-.5l.3-.4c.1-.2 0-.3 0-.5-.1-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.2 3.3 5.3 4.6.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4l-.5-.7zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.2-1.3c1.4.8 3 1.3 4.8 1.3 5.5 0 10-4.5 10-10S17.5 2 12 2z"/></svg>
      Contactar
    </button>
    ${a.status==='pending'?`<button class="btn btn-primary" onclick="updateStatus('${a.id}','confirmed')">Confirmar</button>`:''}
    ${a.status==='confirmed'?`<button class="btn btn-primary" onclick="updateStatus('${a.id}','done')">Marcar concluído</button>`:''}
  `;
  document.getElementById('apptModal').classList.add('open');
}
function closeApptModal(){ document.getElementById('apptModal').classList.remove('open'); }

function updateStatus(id, st){
  const appts = loadAppts();
  const a = appts.find(x=>x.id===id);
  if(a){ a.status=st; saveAppts(appts); }
  closeApptModal();
  renderAll();
}
function cancelAppt(id){
  if(!confirm('Cancelar esta reserva?')) return;
  updateStatus(id,'cancelled');
}
function waAppt(id){
  const a = loadAppts().find(x=>x.id===id);
  if(!a) return;
  const phone = (a.client.phone||'').replace(/\D/g,'') || WHATSAPP_NUMBER;
  const msg = encodeURIComponent(`Olá ${a.client.name.split(' ')[0]}, aqui é da Skin & Soul. Estou a confirmar a sua reserva de ${a.serviceName} em ${formatDate(a.date)} às ${a.time}. Aguardo confirmação.`);
  window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
}

// New appt
function openNewAppt(){
  const sel = document.getElementById('newSvc');
  sel.innerHTML = '<optgroup label="Tratamentos">'+SERVICES.map(s=>`<option value="${s.id}">${s.name} · ${fmt(s.price)}</option>`).join('')+'</optgroup>'+
    '<optgroup label="Pacotes">'+PACKAGES.map(p=>`<option value="${p.id}">${p.name} · ${fmt(p.price)}</option>`).join('')+'</optgroup>';
  document.getElementById('newDate').value = todayStr();
  document.getElementById('newTime').value = '10:00';
  document.getElementById('newName').value = '';
  document.getElementById('newPhone').value = '';
  document.getElementById('newNotes').value = '';
  document.getElementById('newModal').classList.add('open');
}
function closeNewAppt(){ document.getElementById('newModal').classList.remove('open'); }
function saveNewAppt(){
  const sid = document.getElementById('newSvc').value;
  const s = svc(sid);
  const date = document.getElementById('newDate').value;
  const time = document.getElementById('newTime').value;
  const name = document.getElementById('newName').value.trim();
  const phone = document.getElementById('newPhone').value.trim();
  if(!name || !phone || !date || !time){ alert('Preencha todos os campos.'); return; }
  const appts = loadAppts();
  appts.unshift({
    id:'A'+Math.random().toString(36).slice(2,8).toUpperCase(),
    serviceId:sid, serviceName:s.name, price:s.price, duration:s.duration,
    date, time, status:'confirmed',
    client:{name, phone, email:''},
    notes: document.getElementById('newNotes').value.trim(),
    createdAt: Date.now(),
  });
  saveAppts(appts);
  closeNewAppt();
  renderAll();
}

// ===== Render all =====
function renderAll(){
  if(state.view==='overview') renderOverview();
  if(state.view==='appointments') renderAppts();
  if(state.view==='clients') renderClients();
  if(state.view==='services'){ renderSvcCats(); renderSvc(); }
  if(state.view==='finance') renderFinance();
}
renderAll();
