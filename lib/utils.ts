export function fmt(n: number): string {
  return n.toLocaleString("pt-PT").replace(/,/g, " ") + " MT";
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-PT", { day: "numeric", month: "short" });
}

export function statLabel(s: string): string {
  const labels: Record<string, string> = {
    pending: "Pendente",
    confirmed: "Confirmado",
    done: "Concluído",
    cancelled: "Cancelado",
  };
  return labels[s] || s;
}
