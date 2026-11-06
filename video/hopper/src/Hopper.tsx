import type { CSSProperties, ReactNode } from 'react';
import { AbsoluteFill, Easing, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { loadFont } from '@remotion/fonts';
import { textos, type Lang } from './textos';

// Fuentes locales (OFL) para renderizar sin depender de Google Fonts
const SANS = 'Instrument Sans';
const MONO = 'Fragment Mono';
loadFont({ family: SANS, url: staticFile('fonts/InstrumentSans.woff2'), weight: '400 700' });
loadFont({ family: MONO, url: staticFile('fonts/FragmentMono.woff2'), weight: '400' });

// Tokens de josecarloscorona.dev (src/styles/jc-tokens.css)
const c = {
  ink: '#0B0D0E', text2: '#3A3F44', text3: '#5B6168',
  canvas: '#FFFFFF', surface: '#F5F6F7', hairline: '#E3E5E8', hairlineStrong: '#C9CDD2',
  accent: '#1D5C47', accentSoft: '#E6F0EC',
  ok: '#176B3F', okBg: '#E4F3EA', warn: '#835000', warnBg: '#FAF0D7',
};

type T = (typeof textos)[Lang];

const P1 = 390;
const P2 = 750;
const P3 = 420;
export const DURACION = P1 + P2 + P3;

// Tiempos del momento clave, relativos a su inicio
const B = 150;
const C = 300;
const D = 510;
const E = 630;
const ETAPA_2 = 245;

const entra = (f: number, desde: number, dur = 18) =>
  interpolate(f, [desde, desde + dur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
const sale = (f: number, desde: number, dur = 18) => 1 - entra(f, desde, dur);
const sube = (p: number, px = 24): CSSProperties => ({ opacity: p, transform: `translateY(${(1 - p) * px}px)` });
const escribe = (texto: string, f: number, desde: number, cps = 1.2) =>
  texto.slice(0, Math.max(0, Math.floor((f - desde) * cps)));

const Capitulo = ({ texto, f, fin }: { texto: string; f: number; fin: number }) => (
  <div style={{ position: 'absolute', left: 120, top: 84, fontFamily: MONO, fontSize: 22, letterSpacing: 3, color: c.accent, opacity: entra(f, 0) * sale(f, fin - 18) }}>
    {texto}
  </div>
);

const Etiqueta = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => (
  <div style={{ fontFamily: MONO, fontSize: 20, letterSpacing: 1.5, color: c.text3, ...style }}>{children}</div>
);

// Llamadas que van tapando la semana: [día, inicio y alto en fracción del día, texto, cuadro]
const REUNIONES: [number, number, number, number, number][] = [
  [0, 0.08, 0.14, 0, 28], [2, 0.3, 0.14, 2, 50], [1, 0.52, 0.14, 1, 72],
  [3, 0.12, 0.14, 3, 96], [4, 0.62, 0.14, 4, 114], [0, 0.42, 0.14, 1, 132],
  [2, 0.08, 0.14, 5, 150], [1, 0.14, 0.14, 0, 166], [3, 0.46, 0.14, 2, 182],
  [4, 0.08, 0.14, 3, 198], [0, 0.76, 0.14, 4, 212], [2, 0.68, 0.14, 1, 226],
  [1, 0.78, 0.14, 5, 240], [3, 0.8, 0.14, 0, 252], [4, 0.36, 0.14, 2, 264],
  [0, 0.24, 0.12, 3, 276], [2, 0.5, 0.12, 4, 286], [1, 0.34, 0.12, 2, 296],
  [3, 0.3, 0.12, 5, 306], [4, 0.8, 0.12, 0, 316],
];

function Problema({ t }: { t: T }) {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const salida = sale(f, P1 - 18);
  const altoDia = 600;
  return (
    <AbsoluteFill style={{ background: c.canvas, opacity: salida }}>
      <Capitulo texto={t.cap[0]} f={f} fin={P1 + 18} />
      <div style={{ position: 'absolute', left: 120, top: 130, right: 120, fontFamily: SANS, fontSize: 72, fontWeight: 600, letterSpacing: -2, color: c.ink, opacity: sale(f, 232, 14) }}>
        {escribe(t.bug, f, 8)}
      </div>
      <div style={{ position: 'absolute', left: 120, top: 130, right: 120, fontFamily: SANS, fontSize: 72, fontWeight: 600, letterSpacing: -2, color: c.ink, ...sube(entra(f, 244), 14) }}>
        {t.tiempo}
      </div>
      <div style={{ position: 'absolute', left: 120, top: 226, fontFamily: SANS, fontSize: 40, color: c.text2, letterSpacing: -0.4, ...sube(entra(f, 104) * sale(f, 232, 14), 14) }}>
        {t.reunion}
      </div>

      <div style={{ position: 'absolute', left: 120, right: 120, top: 310, height: 660, borderRadius: 16, border: `1.5px solid ${c.hairlineStrong}`, overflow: 'hidden', background: c.canvas, ...sube(entra(f, 6), 30) }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', height: 58, alignItems: 'center', background: c.surface, borderBottom: `1.5px solid ${c.hairlineStrong}`, fontFamily: SANS, fontSize: 24, fontWeight: 600, color: c.text2 }}>
          {t.dias.map((d) => <div key={d} style={{ padding: '0 20px' }}>{d}</div>)}
        </div>
        <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', height: altoDia }}>
          {t.dias.map((d, i) => (
            <div key={d} style={{ position: 'relative', borderLeft: i ? `1px solid ${c.hairline}` : 'none', padding: 8 }}>
              <div style={{ height: '100%', borderRadius: 10, background: c.accentSoft, color: c.accent, padding: '10px 14px', fontFamily: SANS, fontSize: 22, fontWeight: 600 }}>{t.programar}</div>
              {REUNIONES.filter((r) => r[0] === i).map(([, y, h, k, d0]) => {
                const s = spring({ frame: f - d0, fps, config: { damping: 18 } });
                return (
                  <div key={`${y}`} style={{ position: 'absolute', left: 8, right: 8, top: 8 + y * altoDia, height: h * altoDia - 6, borderRadius: 10, background: c.warnBg, border: `1.5px solid ${c.warn}`, padding: '8px 14px', fontFamily: SANS, fontSize: 21, lineHeight: 1.2, fontWeight: 600, color: c.warn, overflow: 'hidden', opacity: s, transform: `scale(${0.92 + s * 0.08})` }}>
                    {t.llamadas[k]}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div style={{ position: 'absolute', left: 120, top: 988, fontFamily: MONO, fontSize: 22, color: c.text3, opacity: entra(f, 20) }}>{t.ilustrativo}</div>
    </AbsoluteFill>
  );
}

const Tarjeta = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => (
  <div style={{ borderRadius: 16, border: `1.5px solid ${c.hairline}`, background: c.canvas, ...style }}>{children}</div>
);

function Dashboard({ t, f }: { t: T; f: number }) {
  const barras = [46, 58, 52, 70, 64, 80, 72, 88, 76, 92, 84, 96];
  const clic = interpolate(f, [52, 58, 66], [1, 0.86, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div style={{ position: 'absolute', inset: 0, padding: 36, background: c.surface }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 26 }}>
        <div style={{ fontFamily: SANS, fontSize: 34, fontWeight: 600, color: c.ink }}>KUBO</div>
        <div style={{ fontFamily: SANS, fontSize: 22, color: c.text2, padding: '8px 18px', border: `1.5px solid ${c.hairlineStrong}`, borderRadius: 12, background: c.canvas }}>{t.rango}</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 18 }}>
        {t.kpis.map(([k, v], i) => (
          <Tarjeta key={k} style={{ padding: '20px 24px', border: `1.5px solid ${i === 2 ? c.accent : c.hairline}` }}>
            <div style={{ fontFamily: MONO, fontSize: 19, letterSpacing: 1, color: c.text3 }}>{k.toUpperCase()}</div>
            <div style={{ fontFamily: SANS, fontSize: 46, fontWeight: 600, color: c.ink, marginTop: 6, fontVariantNumeric: 'tabular-nums' }}>{v}</div>
          </Tarjeta>
        ))}
      </div>
      <Tarjeta style={{ marginTop: 18, padding: '18px 24px', height: 250 }}>
        <div style={{ fontFamily: SANS, fontSize: 24, fontWeight: 600, color: c.ink }}>{t.tendencia}</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, height: 180, marginTop: 10 }}>
          {barras.map((h, i) => <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: '6px 6px 0 0', background: c.hairlineStrong }} />)}
        </div>
      </Tarjeta>
      <div style={{ position: 'absolute', right: 34, bottom: 34, width: 78, height: 78, borderRadius: 39, background: c.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${clic})`, boxShadow: `0 0 0 ${interpolate(f, [30, 52, 60], [0, 12, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}px ${c.accentSoft}` }}>
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={c.canvas} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22V4c4-3 8 3 16 0v11c-8 3-12-3-16 0" /></svg>
      </div>
    </div>
  );
}

const Pregunta = ({ p, children, activa = false }: { p: string; children: ReactNode; activa?: boolean }) => (
  <div style={{ marginBottom: 26 }}>
    <div style={{ fontFamily: SANS, fontSize: 25, fontWeight: 600, color: c.ink, marginBottom: 10 }}>{p}</div>
    <div style={{ minHeight: 66, padding: '16px 20px', borderRadius: 12, border: `1.5px solid ${activa ? c.accent : c.hairlineStrong}`, fontFamily: SANS, fontSize: 25, color: c.ink, background: c.canvas }}>{children}</div>
  </div>
);

function Panel({ t, f }: { t: T; f: number }) {
  const entrada = entra(f, 58, 22);
  const etapa2 = f >= ETAPA_2;
  const etapa3 = f >= D;
  const nombre = etapa3 ? t.e3 : etapa2 ? t.e2 : t.e1;
  const contador = etapa3 ? t.etapa(3, 4) : etapa2 ? t.etapa(2, 4) : t.etapa(1, 9);
  const destello = entra(f, ETAPA_2, 10) * sale(f, ETAPA_2 + 40, 20);
  const comparando = interpolate(f, [C + 22, C + 28, C + 36], [1, 0.95, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 700, background: c.canvas, borderLeft: `1.5px solid ${c.hairlineStrong}`, boxShadow: '-20px 0 50px rgba(11,13,14,0.08)', transform: `translateX(${(1 - entrada) * 720}px)` }}>
      <div style={{ height: 76, background: c.ink, color: c.canvas, fontFamily: SANS, fontSize: 28, fontWeight: 600, display: 'flex', alignItems: 'center', padding: '0 32px' }}>{t.panel}</div>
      <div style={{ padding: '22px 32px 0' }}>
        <div style={{ fontFamily: SANS, fontSize: 22, color: c.text2, opacity: entra(f, 84, 12) }}>{t.reportando} <b style={{ color: c.ink }}>/kubo</b> · {t.contexto}</div>
        <div style={{ margin: '18px 0 26px', padding: '14px 20px', borderRadius: 12, border: `1.5px solid ${destello > 0 ? c.accent : c.hairlineStrong}`, background: destello > 0 ? c.accentSoft : c.canvas, textAlign: 'center' }}>
          <div style={{ fontFamily: SANS, fontSize: 24, fontWeight: 600, color: c.ink }}>{nombre}</div>
          <div style={{ fontFamily: SANS, fontSize: 21, marginTop: 2, color: destello > 0 ? c.accent : c.text3, fontWeight: destello > 0 ? 600 : 400 }}>{contador}</div>
        </div>
        {!etapa2 && (
          <div>
            <Pregunta p={t.esperabas} activa={f >= B + 15 && f < B + 50}>{escribe(t.esperabasR, f, B + 15)}</Pregunta>
            <Pregunta p={t.viste} activa={f >= B + 50}>{escribe(t.visteR, f, B + 50)}</Pregunta>
          </div>
        )}
        {etapa2 && !etapa3 && (
          <div style={{ opacity: entra(f, ETAPA_2, 12) }}>
            <Pregunta p={t.fuenteP}>{t.fuenteR}</Pregunta>
            <Pregunta p={t.capturaP}><span style={{ fontFamily: MONO, fontSize: 22 }}>kubo-ga4.png</span></Pregunta>
            <div style={{ display: 'inline-block', padding: '16px 26px', borderRadius: 12, background: f >= C + 30 ? c.accentSoft : c.accent, color: f >= C + 30 ? c.accent : c.canvas, fontFamily: SANS, fontSize: 25, fontWeight: 600, transform: `scale(${comparando})` }}>{t.comparar}</div>
          </div>
        )}
        {etapa3 && (
          <div style={{ opacity: entra(f, D, 12) }}>
            <Pregunta p={t.alcanceP}>{f >= D + 14 ? t.alcanceR : ''}</Pregunta>
            <Pregunta p={t.caraP}>{f >= D + 36 ? t.caraR : ''}</Pregunta>
          </div>
        )}
      </div>
    </div>
  );
}

function Comparacion({ t, f }: { t: T; f: number }) {
  const visible = entra(f, C + 36, 16) * sale(f, D, 12);
  if (visible === 0) return null;
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 980, background: c.canvas, padding: 36, opacity: visible, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <Tarjeta style={{ padding: 24, height: 210, ...sube(entra(f, C + 50, 14), 14) }}>
          <Etiqueta>{t.ia}</Etiqueta>
          <div style={{ fontFamily: SANS, fontSize: 27, fontWeight: 600, color: c.ink, marginTop: 10, lineHeight: 1.2 }}>{t.iaT}</div>
          <div style={{ fontFamily: MONO, fontSize: 21, color: c.text2, marginTop: 16 }}>{t.iaR}</div>
        </Tarjeta>
        <Tarjeta style={{ padding: 24, height: 210, border: `1.5px solid ${c.accent}`, background: c.accentSoft, ...sube(entra(f, C + 90, 14), 14) }}>
          <Etiqueta style={{ color: c.accent }}>{t.codigo}</Etiqueta>
          <div style={{ fontFamily: SANS, fontSize: 27, fontWeight: 600, color: c.ink, marginTop: 10, lineHeight: 1.2 }}>{t.codigoT}</div>
          <div style={{ fontFamily: SANS, fontSize: 40, fontWeight: 600, color: c.accent, marginTop: 8, fontVariantNumeric: 'tabular-nums' }}>9,800</div>
        </Tarjeta>
      </div>
      <div style={{ marginTop: 28, borderRadius: 16, border: `1.5px solid ${c.hairline}`, overflow: 'hidden', ...sube(entra(f, C + 125, 14), 14) }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', background: c.surface, fontFamily: SANS, fontSize: 23, fontWeight: 600, color: c.text2 }}>
          {t.tabla.map((h) => <div key={h} style={{ padding: '14px 20px' }}>{h}</div>)}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', borderTop: `1.5px solid ${c.hairline}`, fontFamily: SANS, fontSize: 30, color: c.ink, fontVariantNumeric: 'tabular-nums' }}>
          {[t.concepto, '12,400', '9,800', '2,600'].map((v, i) => <div key={i} style={{ padding: '18px 20px', fontWeight: i === 0 ? 600 : 400 }}>{v}</div>)}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginTop: 28, ...sube(entra(f, C + 150, 14), 14) }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '10px 18px', borderRadius: 999, fontFamily: SANS, fontSize: 26, fontWeight: 600, color: c.warn, background: c.warnBg }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill={c.warn}><path d="M12 3 22 20H2z" /></svg>{t.fuera}
        </span>
        <span style={{ fontFamily: MONO, fontSize: 22, color: c.text3 }}>{t.tolerancia}</span>
      </div>
    </div>
  );
}

function Rubrica({ t, f }: { t: T; f: number }) {
  const { fps } = useVideoConfig();
  const visible = entra(f, D, 14);
  if (visible === 0) return null;
  const p1 = spring({ frame: f - (D + 62), fps, config: { damping: 14 } });
  const filas: [string, string, number][] = [[t.rCategoria, t.rCategoriaV, 8], [t.rAlcance, t.rAlcanceV, 22], [t.rCara, t.rCaraV, 44]];
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 980, background: c.canvas, padding: 36, opacity: visible, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <Etiqueta>{t.rubrica}</Etiqueta>
      <div style={{ marginTop: 20 }}>
        {filas.map(([k, v, d]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 0', borderBottom: `1.5px solid ${c.hairline}`, fontFamily: SANS, fontSize: 30, ...sube(entra(f, D + d, 12), 10) }}>
            <span style={{ color: c.text2 }}>{k}</span>
            <span style={{ fontFamily: MONO, fontSize: 25, color: c.ink }}>{v}</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 32, marginTop: 40, opacity: p1 }}>
        <div style={{ fontFamily: SANS, fontSize: 170, fontWeight: 600, letterSpacing: -5, lineHeight: 1, color: c.accent, transform: `scale(${0.8 + p1 * 0.2})` }}>P1</div>
        <div style={{ fontFamily: SANS, fontSize: 32, lineHeight: 1.25, color: c.text2, maxWidth: 560 }}>{t.rRazon}</div>
      </div>
    </div>
  );
}

function Issue({ t, f }: { t: T; f: number }) {
  const visible = entra(f, E, 14);
  if (visible === 0) return null;
  const Linea = ({ k, v, luz = 0 }: { k: string; v: string; luz?: number }) => (
    <div style={{ padding: '16px', margin: '0 -16px', borderRadius: 10, background: luz > 0 ? `rgba(230,240,236,${luz})` : 'transparent', fontFamily: SANS, fontSize: 32, color: c.text2 }}>
      <b style={{ color: c.ink }}>{k}</b> {v}
    </div>
  );
  return (
    <div style={{ position: 'absolute', inset: 0, background: c.canvas, padding: '34px 48px', opacity: visible }}>
      <div style={{ fontFamily: SANS, fontSize: 52, fontWeight: 600, letterSpacing: -1.2, color: c.ink }}>{t.issueTitulo} <span style={{ color: c.text3, fontWeight: 400 }}>#42</span></div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 18, flexWrap: 'wrap' }}>
        <span style={{ padding: '8px 18px', borderRadius: 999, background: c.ok, color: c.canvas, fontFamily: SANS, fontSize: 23, fontWeight: 600 }}>{t.abierto}</span>
        <span style={{ fontFamily: SANS, fontSize: 24, color: c.text2 }}><b style={{ color: c.ink }}>hopper-issues-bot</b> {t.abrio}</span>
        {t.etiquetas.map((e) => <span key={e} style={{ padding: '6px 16px', borderRadius: 999, border: `1.5px solid ${c.hairlineStrong}`, fontFamily: MONO, fontSize: 20, color: c.text2 }}>{e}</span>)}
      </div>
      <div style={{ marginTop: 32, padding: '30px 40px', borderRadius: 16, border: `1.5px solid ${c.hairline}` }}>
        <Linea k={t.iCategoria} v={t.rCategoriaV} luz={entra(f, E + 22, 12)} />
        <Linea k={t.iPrioridad} v={t.iPrioridadV} luz={entra(f, E + 42, 12)} />
        <Linea k={t.iComparacion} v={t.iComparacionV} luz={entra(f, E + 62, 12)} />
        <Linea k={t.iEsperaba} v={t.esperabasR} />
        <Linea k={t.iVio} v={t.visteR} />
      </div>
    </div>
  );
}

function MomentoClave({ t }: { t: T }) {
  const f = useCurrentFrame();
  const salida = sale(f, P2 - 18);
  const frases: [string, number, number][] = [[t.capA, 4, B], [t.capB, B, C], [t.capC, C, D], [t.capD, D, E], [t.capE, E, P2 + 30]];
  return (
    <AbsoluteFill style={{ background: c.canvas, opacity: salida }}>
      <Capitulo texto={t.cap[1]} f={f} fin={P2 + 18} />
      {frases.map(([texto, ini, fin]) => (
        <div key={texto} style={{ position: 'absolute', left: 120, right: 120, top: 136, fontFamily: SANS, fontSize: 46, fontWeight: 600, letterSpacing: -1, color: c.ink, ...sube(entra(f, ini, 14) * sale(f, fin - 12, 12), 12) }}>{texto}</div>
      ))}
      <div style={{ position: 'absolute', left: 120, top: 228, width: 1680, height: 770, borderRadius: 24, border: `1.5px solid ${c.hairlineStrong}`, overflow: 'hidden', boxShadow: '0 24px 60px rgba(11,13,14,0.08)', background: c.canvas, ...sube(entra(f, 8), 30) }}>
        <Dashboard t={t} f={f} />
        <Comparacion t={t} f={f} />
        <Rubrica t={t} f={f} />
        <Panel t={t} f={f} />
        <Issue t={t} f={f} />
      </div>
      <div style={{ position: 'absolute', left: 120, top: 1018, fontFamily: MONO, fontSize: 22, color: c.text3, opacity: entra(f, 20) }}>{t.ficticio}</div>
    </AbsoluteFill>
  );
}

function Resultado({ t }: { t: T }) {
  const f = useCurrentFrame();
  const cierre = entra(f, 270, 24);
  return (
    <AbsoluteFill style={{ background: c.canvas }}>
      <Capitulo texto={t.cap[2]} f={f} fin={270} />
      <div style={{ opacity: 1 - cierre }}>
        <div style={{ position: 'absolute', left: 120, top: 250, right: 120, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60 }}>
          {t.cifras.map((cf, i) => {
            const d = 20 + i * 22;
            const n = cf.v * interpolate(f, [d, d + 50], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
            return (
              <div key={cf.l} style={{ borderTop: `3px solid ${c.accent}`, paddingTop: 30, ...sube(entra(f, d, 16)) }}>
                <div style={{ fontFamily: SANS, fontSize: 150, fontWeight: 600, letterSpacing: -5, color: c.ink, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{cf.fmt(n)}</div>
                <div style={{ fontFamily: SANS, fontSize: 32, color: c.text2, marginTop: 20, lineHeight: 1.25 }}>{cf.l}</div>
              </div>
            );
          })}
        </div>
        <div style={{ position: 'absolute', left: 120, top: 640, fontFamily: MONO, fontSize: 26, color: c.text3, opacity: entra(f, 90) }}>{t.fuente}</div>
        <div style={{ position: 'absolute', left: 120, top: 750, right: 200, fontFamily: SANS, fontSize: 58, lineHeight: 1.2, letterSpacing: -1.2, color: c.ink, paddingLeft: 36, borderLeft: `4px solid ${c.accent}`, ...sube(entra(f, 120, 20)) }}>
          {t.cita}
        </div>
      </div>
      <AbsoluteFill style={{ justifyContent: 'center', padding: '0 120px', opacity: cierre }}>
        <div style={{ fontFamily: SANS, fontSize: 76, fontWeight: 600, letterSpacing: -2.2, color: c.ink, ...sube(cierre) }}>{t.cierre1}</div>
        <div style={{ fontFamily: SANS, fontSize: 40, color: c.text2, marginTop: 28, ...sube(entra(f, 288, 20)) }}>{t.cierre2}</div>
        <div style={{ fontFamily: MONO, fontSize: 26, color: c.accent, marginTop: 70, letterSpacing: 1, ...sube(entra(f, 310, 20)) }}>{t.firma}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

export const Hopper = ({ lang }: { lang: Lang }) => {
  const t = textos[lang];
  return (
    <AbsoluteFill style={{ background: c.canvas }}>
      <Sequence durationInFrames={P1}><Problema t={t} /></Sequence>
      <Sequence from={P1} durationInFrames={P2}><MomentoClave t={t} /></Sequence>
      <Sequence from={P1 + P2} durationInFrames={P3}><Resultado t={t} /></Sequence>
    </AbsoluteFill>
  );
};
