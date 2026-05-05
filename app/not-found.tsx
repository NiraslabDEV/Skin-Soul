export default function NotFound() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '40px 20px', background: 'var(--bone)', textAlign: 'center' }}>
      <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(40px, 8vw, 80px)', fontWeight: 300, color: 'var(--emerald)', marginBottom: '24px', letterSpacing: '-0.02em' }}>404</h1>
      <p style={{ fontFamily: 'var(--serif)', fontSize: '22px', fontStyle: 'italic', color: 'var(--emerald)', opacity: 0.7, marginBottom: '40px', maxWidth: '480px' }}>Página não encontrada</p>
      <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
        <a href="/" style={{ padding: '14px 26px', borderRadius: '999px', fontSize: '13px', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500, transition: 'all 0.25s', background: 'var(--emerald)', color: '#fff', textDecoration: 'none' }}>
          Voltar ao início
        </a>
        <a href="/dashboard" style={{ padding: '14px 26px', borderRadius: '999px', fontSize: '13px', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500, transition: 'all 0.25s', border: '1px solid var(--emerald)', background: 'transparent', color: 'var(--emerald)', textDecoration: 'none' }}>
          Painel interno
        </a>
      </div>
    </div>
  );
}