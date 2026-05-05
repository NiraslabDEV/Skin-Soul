export type Service = {
  id: string;
  cat: string;
  catLabel: string;
  name: string;
  desc: string;
  price: number;
  duration: number;
  icon: string;
};

export type Package = {
  id: string;
  cat: string;
  name: string;
  tag: string | null;
  featured?: boolean;
  desc: string;
  price: number;
  originalPrice: number | null;
  duration: string;
  includes: string[];
};

export type Category = { id: string; name: string };

export const CATEGORIES: Category[] = [
  { id: "all", name: "Todos" },
  { id: "facial", name: "Faciais" },
  { id: "derm", name: "Dermaplaning" },
  { id: "body", name: "Corporais" },
  { id: "exf", name: "Esfoliação" },
  { id: "depil", name: "Depilação" },
  { id: "bright", name: "Clareamento" },
  { id: "lash", name: "Pestanas" },
];

export const SERVICES: Service[] = [
  // FACIAIS
  { id: "f-hg", cat: "facial", catLabel: "Limpeza facial · pele seca", name: "Hydra Glow", desc: "Hidratação profunda para peles secas. Devolve maciez, viço e equilíbrio.", price: 2000, duration: 60, icon: "facial" },
  { id: "f-cs", cat: "facial", catLabel: "Limpeza facial · pele oleosa", name: "Clear Skin Therapy", desc: "Protocolo de purificação para peles oleosas e mistas. Controlo do brilho, poros refinados.", price: 2600, duration: 75, icon: "facial" },
  { id: "f-sh", cat: "facial", catLabel: "Limpeza facial · pele normal", name: "Skin Harmony", desc: "Equilíbrio diário para peles normais. Hidrata, ilumina e suaviza.", price: 2200, duration: 60, icon: "facial" },
  { id: "f-ac", cat: "facial", catLabel: "Limpeza facial · pele madura", name: "Age Control", desc: "Tratamento firmador anti-idade com ativos peptídicos e massagem lifting.", price: 2700, duration: 75, icon: "facial" },
  { id: "f-vc", cat: "facial", catLabel: "Limpeza facial · todos os tipos", name: "Vitamina C", desc: "Antioxidante de luminosidade. Indicado para todos os tipos de pele.", price: 2500, duration: 60, icon: "facial" },
  { id: "f-re", cat: "facial", catLabel: "Limpeza facial · pigmentada", name: "Radiance Even", desc: "Uniformização de tom para peles pigmentadas. Reduz manchas e melasma.", price: 2800, duration: 75, icon: "facial" },
  // DERMAPLANING
  { id: "dp-bas", cat: "derm", catLabel: "Dermaplaning", name: "Dermaplaning básico", desc: "Esfoliação cirúrgica que remove pelos e células mortas. Pele lisa e luminosa.", price: 2800, duration: 60, icon: "derm" },
  { id: "dp-hb", cat: "derm", catLabel: "Dermaplaning premium", name: "Dermaplaning + Honeybush", desc: "Dermaplaning seguido de protocolo calmante com honeybush. Anti-inflamatório.", price: 4300, duration: 90, icon: "derm" },
  { id: "dp-vc", cat: "derm", catLabel: "Dermaplaning premium", name: "Dermaplaning + Vitamina C", desc: "Dermaplaning com infusão de vitamina C — máxima luminosidade.", price: 4850, duration: 90, icon: "derm" },
  { id: "dp-ss", cat: "derm", catLabel: "Dermaplaning signature", name: "Dermaplaning Skin & Soul", desc: "O nosso ritual signature. Dermaplaning completo com protocolo terapêutico.", price: 5000, duration: 120, icon: "derm" },
  // CORPORAIS
  { id: "b-mas", cat: "body", catLabel: "Cuidado corporal", name: "Massagem", desc: "Toque consciente com óleos quentes e aromaterapia. Relaxa o corpo e a respiração.", price: 2200, duration: 90, icon: "massage" },
  { id: "b-dre", cat: "body", catLabel: "Cuidado corporal", name: "Drenagem linfática", desc: "Técnica manual para reduzir inchaço e restaurar a circulação. Sensação de leveza.", price: 2000, duration: 60, icon: "drainage" },
  // ESFOLIAÇÃO
  { id: "e-bz", cat: "exf", catLabel: "Esfoliação corporal", name: "Terapia Bronze", desc: "À base de café — desperta a circulação, deixa a pele macia e perfumada.", price: 1200, duration: 45, icon: "exfoliate" },
  { id: "e-au", cat: "exf", catLabel: "Esfoliação corporal", name: "Aura Dourada", desc: "À base de turmeric — anti-inflamatória e iluminadora. Pele dourada e renovada.", price: 1200, duration: 45, icon: "exfoliate" },
  // DEPILAÇÃO feminino
  { id: "d-fbu", cat: "depil", catLabel: "Depilação feminina", name: "Buço", desc: "Cera suave para o lábio superior. Resultado preciso e duradouro.", price: 200, duration: 15, icon: "depil" },
  { id: "d-fax", cat: "depil", catLabel: "Depilação feminina", name: "Axilas", desc: "Cera suave nas axilas, com loção pós-depilação calmante.", price: 400, duration: 20, icon: "depil" },
  { id: "d-fbr", cat: "depil", catLabel: "Depilação feminina", name: "Braços", desc: "Depilação completa dos braços com cera botânica.", price: 600, duration: 30, icon: "depil" },
  { id: "d-fmp", cat: "depil", catLabel: "Depilação feminina", name: "Meia perna", desc: "Da coxa ou do joelho para baixo. Cera suave e finalização hidratante.", price: 700, duration: 30, icon: "depil" },
  { id: "d-fpi", cat: "depil", catLabel: "Depilação feminina", name: "Perna inteira", desc: "Depilação completa da perna com cera suave e cuidado pós-depilação.", price: 900, duration: 45, icon: "depil" },
  { id: "d-fvs", cat: "depil", catLabel: "Depilação feminina", name: "Virilha simples", desc: "Linha externa da virilha. Procedimento gentil e respeitoso.", price: 600, duration: 20, icon: "depil" },
  { id: "d-fvc", cat: "depil", catLabel: "Depilação feminina", name: "Virilha cavada", desc: "Cavada com design discreto. Cera específica para áreas sensíveis.", price: 450, duration: 25, icon: "depil" },
  { id: "d-fvt", cat: "depil", catLabel: "Depilação feminina", name: "Virilha completa", desc: "Design total da virilha. Acabamento limpo e duradouro.", price: 800, duration: 30, icon: "depil" },
  // DEPILAÇÃO masculino
  { id: "d-mno", cat: "depil", catLabel: "Depilação masculina", name: "Nariz / Orelhas", desc: "Acabamento discreto e preciso. Cera específica para áreas sensíveis.", price: 400, duration: 15, icon: "depil" },
  { id: "d-max", cat: "depil", catLabel: "Depilação masculina", name: "Axilas (M)", desc: "Cera específica masculina, com loção pós-depilação.", price: 550, duration: 20, icon: "depil" },
  { id: "d-mpa", cat: "depil", catLabel: "Depilação masculina", name: "Peito + Abdómen", desc: "Depilação completa do tronco frontal.", price: 850, duration: 45, icon: "depil" },
  { id: "d-mco", cat: "depil", catLabel: "Depilação masculina", name: "Costas completas", desc: "Depilação total das costas com cera botânica.", price: 900, duration: 45, icon: "depil" },
  { id: "d-mbr", cat: "depil", catLabel: "Depilação masculina", name: "Braços (M)", desc: "Depilação completa dos braços masculinos.", price: 750, duration: 30, icon: "depil" },
  { id: "d-mpi", cat: "depil", catLabel: "Depilação masculina", name: "Perna inteira (M)", desc: "Depilação completa da perna masculina com cera.", price: 1100, duration: 45, icon: "depil" },
  { id: "d-mba", cat: "depil", catLabel: "Depilação masculina", name: "Barba completa", desc: "Modelagem com cera para um acabamento limpo e definido.", price: 700, duration: 30, icon: "depil" },
  // CLAREAMENTO
  { id: "c-ax1", cat: "bright", catLabel: "Clareamento · sessão avulsa", name: "Clareamento de axilas", desc: "Sessão única de protocolo clareador para axilas com ativos botânicos.", price: 600, duration: 30, icon: "brighten" },
  { id: "c-vi1", cat: "bright", catLabel: "Clareamento · sessão avulsa", name: "Clareamento de virilha", desc: "Sessão única de protocolo clareador para virilha com ativos botânicos.", price: 850, duration: 45, icon: "brighten" },
  // PESTANAS
  { id: "l-cl", cat: "lash", catLabel: "Pestanas · aplicação", name: "Aplicação clássica", desc: "Volume natural fio-a-fio. Aplicação sob ritual de relaxamento.", price: 800, duration: 90, icon: "lash" },
  { id: "l-4d", cat: "lash", catLabel: "Pestanas · aplicação", name: "Aplicação volume 4D", desc: "Volume denso e dramático com técnica 4D.", price: 1000, duration: 120, icon: "lash" },
  { id: "l-br", cat: "lash", catLabel: "Pestanas · aplicação", name: "Aplicação volume brasileiro", desc: "Volume cheio com efeito molhado, característico do brasileiro.", price: 1000, duration: 120, icon: "lash" },
  { id: "l-mcl", cat: "lash", catLabel: "Pestanas · manutenção até 3 sem.", name: "Manutenção clássica", desc: "Reposição e finalização para manter o look clássico.", price: 650, duration: 60, icon: "lash" },
  { id: "l-m4d", cat: "lash", catLabel: "Pestanas · manutenção até 3 sem.", name: "Manutenção volume 4D", desc: "Reposição para manter o volume 4D em forma.", price: 800, duration: 75, icon: "lash" },
  { id: "l-mbr", cat: "lash", catLabel: "Pestanas · manutenção até 3 sem.", name: "Manutenção volume brasileiro", desc: "Reposição para manter o volume brasileiro em forma.", price: 800, duration: 75, icon: "lash" },
  { id: "l-rm", cat: "lash", catLabel: "Pestanas · remoção", name: "Remoção de pestanas", desc: "Remoção segura e gentil das extensões.", price: 300, duration: 30, icon: "lash" },
];

export const PACKAGES: Package[] = [
  { id: "pk-pls", cat: "Combo · Feminino", name: "Pele de Seda", tag: "Mais procurado", featured: true, desc: "Perna inteira + virilha completa + axilas. O combo feminino mais escolhido — pele lisa de cima a baixo.", price: 1800, originalPrice: 2100, duration: "≈ 1h30", includes: ["Perna inteira", "Virilha completa", "Axilas", "Loção pós-depilação calmante"] },
  { id: "pk-cl", cat: "Combo · Masculino", name: "Corpo Limpo", tag: null, desc: "Peito + costas + axilas. O cuidado completo masculino, num só ritual.", price: 2000, originalPrice: 2300, duration: "≈ 1h30", includes: ["Peito + abdómen", "Costas completas", "Axilas (M)", "Loção pós-depilação"] },
  { id: "pk-em", cat: "Combo · Esfoliação", name: "Esfoliação + Massagem nas costas", tag: null, desc: "Esfoliação corporal seguida de massagem direccionada às costas. Uma hora de pura libertação.", price: 1800, originalPrice: null, duration: "1h", includes: ["Esfoliação à escolha (Bronze ou Aura Dourada)", "Massagem nas costas", "Aromaterapia", "Hidratação final"] },
  { id: "pk-ax4", cat: "Clareamento · Axilas", name: "Axilas · 4 sessões", tag: null, desc: "Programa inicial de quatro sessões com ativos botânicos. Resultados graduais.", price: 2000, originalPrice: 2400, duration: "4 sessões", includes: ["4 sessões de clareamento", "Avaliação inicial", "Kit de manutenção em casa"] },
  { id: "pk-ax6", cat: "Clareamento · Axilas", name: "Axilas · 6 sessões", tag: null, desc: "Programa intermédio de seis sessões — equilíbrio ideal entre tempo e resultado.", price: 3000, originalPrice: 3600, duration: "6 sessões", includes: ["6 sessões de clareamento", "Avaliação inicial", "Kit de manutenção", "Follow-up"] },
  { id: "pk-ax8", cat: "Clareamento · Axilas", name: "Axilas · 8 sessões", tag: "Resultados máximos", desc: "Programa completo de oito sessões para máxima uniformização do tom.", price: 4000, originalPrice: 4800, duration: "8 sessões", includes: ["8 sessões de clareamento", "Avaliação inicial", "Kit de manutenção", "Follow-up mensal"] },
  { id: "pk-vi4", cat: "Clareamento · Virilha", name: "Virilha · 4 sessões", tag: null, desc: "Programa inicial de quatro sessões — protocolo discreto e seguro.", price: 2900, originalPrice: 3400, duration: "4 sessões", includes: ["4 sessões de clareamento", "Avaliação inicial", "Kit de manutenção"] },
  { id: "pk-vi6", cat: "Clareamento · Virilha", name: "Virilha · 6 sessões", tag: null, desc: "Programa intermédio de seis sessões para resultados consistentes.", price: 4300, originalPrice: 5100, duration: "6 sessões", includes: ["6 sessões de clareamento", "Avaliação inicial", "Kit de manutenção", "Follow-up"] },
  { id: "pk-vi8", cat: "Clareamento · Virilha", name: "Virilha · 8 sessões", tag: "Resultados máximos", desc: "Programa completo de oito sessões para a máxima uniformização do tom.", price: 5800, originalPrice: 6900, duration: "8 sessões", includes: ["8 sessões de clareamento", "Avaliação inicial", "Kit de manutenção", "Follow-up mensal"] },
];

export function getSvc(id: string): Service | Package | undefined {
  return (SERVICES.find((s) => s.id === id) || PACKAGES.find((p) => p.id === id)) as Service | Package | undefined;
}

export const PLANTS = {
  branch: `<svg viewBox="0 0 200 400" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet"><path d="M100 0 Q 60 100 100 200 Q 140 300 80 400" stroke="currentColor" stroke-width="1.2" fill="none" opacity=".6"/><path d="M85 50 Q 50 60 35 90 Q 65 95 95 75 Z" fill="currentColor" opacity=".55"/><path d="M115 100 Q 160 105 175 140 Q 140 145 105 120 Z" fill="currentColor" opacity=".55"/><path d="M80 160 Q 35 165 20 200 Q 60 210 100 180 Z" fill="currentColor" opacity=".55"/><path d="M120 220 Q 170 215 185 260 Q 145 270 110 240 Z" fill="currentColor" opacity=".55"/><path d="M85 290 Q 45 290 25 325 Q 65 340 100 310 Z" fill="currentColor" opacity=".55"/><path d="M105 350 Q 150 350 165 380 Q 130 390 95 370 Z" fill="currentColor" opacity=".55"/></svg>`,
  monstera: `<svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M120 230 C 60 220 20 170 20 110 C 20 60 60 20 120 20 C 180 20 220 60 220 110 C 220 170 180 220 120 230 Z M120 230 L 120 30 M50 80 L 90 90 M55 130 L 90 130 M70 175 L 100 165 M180 80 L 145 90 M185 130 L 150 130 M170 175 L 140 165" stroke="currentColor" stroke-width="1.2" fill="currentColor" fill-opacity=".15" opacity=".8"/></svg>`,
  sprig: `<svg viewBox="0 0 80 120" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M40 0 Q 40 60 40 120" stroke="currentColor" stroke-width="1" opacity=".7"/><ellipse cx="25" cy="25" rx="15" ry="6" transform="rotate(-30 25 25)" fill="currentColor" opacity=".6"/><ellipse cx="55" cy="50" rx="15" ry="6" transform="rotate(30 55 50)" fill="currentColor" opacity=".6"/><ellipse cx="25" cy="75" rx="15" ry="6" transform="rotate(-30 25 75)" fill="currentColor" opacity=".6"/><ellipse cx="55" cy="100" rx="15" ry="6" transform="rotate(30 55 100)" fill="currentColor" opacity=".6"/></svg>`,
  vine: `<svg viewBox="0 0 120 320" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M60 0 Q 30 50 60 100 Q 90 150 60 200 Q 30 250 60 320" stroke="currentColor" stroke-width="1" opacity=".55"/><ellipse cx="40" cy="30" rx="14" ry="5" transform="rotate(-25 40 30)" fill="currentColor" opacity=".5"/><ellipse cx="80" cy="80" rx="14" ry="5" transform="rotate(20 80 80)" fill="currentColor" opacity=".5"/><ellipse cx="40" cy="130" rx="14" ry="5" transform="rotate(-25 40 130)" fill="currentColor" opacity=".5"/><ellipse cx="80" cy="180" rx="14" ry="5" transform="rotate(20 80 180)" fill="currentColor" opacity=".5"/><ellipse cx="40" cy="230" rx="14" ry="5" transform="rotate(-25 40 230)" fill="currentColor" opacity=".5"/><ellipse cx="80" cy="280" rx="14" ry="5" transform="rotate(20 80 280)" fill="currentColor" opacity=".5"/></svg>`,
};

export const ICONS = {
  facial: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 3c-4 0-7 3.5-7 8 0 3.5 2 6.5 4.5 8 .8.5 1.7.7 2.5.7s1.7-.2 2.5-.7C17 17.5 19 14.5 19 11c0-4.5-3-8-7-8z"/><circle cx="9.5" cy="11" r="1"/><circle cx="14.5" cy="11" r="1"/><path d="M10 15c.5.5 1.2.8 2 .8s1.5-.3 2-.8"/></svg>`,
  body: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 3a7 7 0 017 7c0 3-2 5-3 6.5C15 18 14 20 14 21h-4c0-1-1-3-2-4.5C7 15 5 13 5 10a7 7 0 017-7z"/><path d="M9 11c1 .5 2 .8 3 .8s2-.3 3-.8"/></svg>`,
  depil: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 21l8-8M11 13l3-3 4 4-3 3M14 10l3-3 1.5 1.5M17 7l1.5-1.5L20 7l-1.5 1.5"/><circle cx="6" cy="18" r="1.5"/></svg>`,
  lash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 12c2-4 6-6 10-6s8 2 10 6c-2 4-6 6-10 6S4 16 2 12z"/><circle cx="12" cy="12" r="2.5"/><path d="M12 4v2M16 5l-1 2M8 5l1 2M20 8l-2 1M4 8l2 1"/></svg>`,
  massage: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 14c2-2 5-2 7 0s5 2 7 0 4-2 4-2"/><path d="M3 18c2-2 5-2 7 0s5 2 7 0 4-2 4-2"/><circle cx="6" cy="8" r="2"/></svg>`,
  drainage: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 3c-3 4-6 7-6 11a6 6 0 0012 0c0-4-3-7-6-11z"/></svg>`,
  exfoliate: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="6" cy="6" r="1.2"/><circle cx="12" cy="5" r="1.2"/><circle cx="18" cy="7" r="1.2"/><circle cx="5" cy="13" r="1.2"/><circle cx="11" cy="12" r="1.2"/><circle cx="18" cy="13" r="1.2"/><circle cx="7" cy="19" r="1.2"/><circle cx="13" cy="19" r="1.2"/><circle cx="19" cy="19" r="1.2"/></svg>`,
  brighten: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"/></svg>`,
  derm: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 3l7 7-11 11H3v-7z"/><path d="M14 3l-3 3M17 6l-3 3"/></svg>`,
  clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>`,
  plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 5v14M5 12h14"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 12l5 5L20 7"/></svg>`,
  minus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 12h14"/></svg>`,
};
