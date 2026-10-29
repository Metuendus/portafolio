import type { CSSProperties, ReactNode } from 'react';
import { AbsoluteFill, Easing, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { loadFont } from '@remotion/fonts';
import { textos, plataformas, type Lang } from './textos';

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

const P1 = 420;
const P2 = 690;
const P3 = 450;
export const DURACION = P1 + P2 + P3;

const entra = (f: number, desde: number, dur = 18) =>
  interpolate(f, [desde, desde + dur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
const sale = (f: number, desde: number, dur = 18) => 1 - entra(f, desde, dur);
const sube = (p: number, px = 24): CSSProperties => ({ opacity: p, transform: `translateY(${(1 - p) * px}px)` });

const escribe = (texto: string, f: number, desde: number, cps = 1.6) =>
  texto.slice(0, Math.max(0, Math.floor((f - desde) * cps)));

const Capitulo = ({ texto, f, fin }: { texto: string; f: number; fin: number }) => (
  <div style={{ position: 'absolute', left: 120, top: 96, fontFamily: MONO, fontSize: 22, letterSpacing: 3, color: c.accent, opacity: entra(f, 0) * sale(f, fin - 18) }}>
    {texto}
  </div>
);

const Leyenda = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => (
  <div style={{ fontFamily: SANS, fontSize: 40, lineHeight: 1.25, color: c.text2, letterSpacing: -0.4, ...style }}>{children}</div>
);

const Chip = ({ children, activo = false, style }: { children: ReactNode; activo?: boolean; style?: CSSProperties }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 10, padding: '10px 18px', borderRadius: 999, fontFamily: SANS, fontSize: 26, fontWeight: 500,
    border: `1.5px solid ${activo ? c.accent : c.hairlineStrong}`, background: activo ? c.accentSoft : c.canvas, color: activo ? c.accent : c.text2, ...style,
  }}>{children}</span>
);

function Problema({ t }: { t: (typeof textos)[Lang] }) {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dispersa = interpolate(f, [330, P1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.cubic) });
  return (
    <AbsoluteFill style={{ background: c.canvas }}>
      <Capitulo texto={t.cap[0]} f={f} fin={P1} />
      <div style={{ position: 'absolute', left: 120, top: 190, right: 120, fontFamily: SANS, fontSize: 76, fontWeight: 600, letterSpacing: -2, color: c.ink, opacity: sale(f, P1 - 20) }}>
        {escribe(t.pregunta, f, 12)}
        <span style={{ opacity: f < 90 && Math.floor(f / 15) % 2 === 0 ? 1 : 0, color: c.accent }}>|</span>
      </div>
      <div style={{ position: 'absolute', left: 120, top: 360, display: 'grid', gridTemplateColumns: 'repeat(3, 540px)', gap: 30 }}>
        {plataformas.map((p, i) => {
          const s = spring({ frame: f - 90 - i * 7, fps, config: { damping: 18 } });
          const dx = (i % 3 - 1) * 260 * dispersa;
          const dy = (Math.floor(i / 3) * 2 - 1) * 140 * dispersa;
          return (
            <div key={p} style={{
              height: 150, borderRadius: 20, border: `1.5px solid ${c.hairline}`, background: c.surface, padding: '28px 32px',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              opacity: s * (1 - dispersa), transform: `translate(${dx}px, ${dy + (1 - s) * 40}px) rotate(${(i % 2 ? 1 : -1) * 3 * dispersa}deg)`,
            }}>
              <div style={{ fontFamily: SANS, fontSize: 32, fontWeight: 600, color: c.ink }}>{p}</div>
              <div style={{ display: 'flex', gap: 10 }}>
                {[0.9, 0.55, 0.75, 0.4].map((w, j) => (
                  <div key={j} style={{ height: 12, width: 90 * w, borderRadius: 6, background: c.hairlineStrong }} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <Leyenda style={{ position: 'absolute', left: 120, top: 760, ...sube(entra(f, 150) * sale(f, 330)) }}>{t.repartida}</Leyenda>
      <Leyenda style={{ position: 'absolute', left: 120, top: 820, color: c.text3, ...sube(entra(f, 220) * sale(f, 330)) }}>{t.aMano}</Leyenda>
    </AbsoluteFill>
  );
}

function MomentoClave({ t }: { t: (typeof textos)[Lang] }) {
  const f = useCurrentFrame();
  const enviado = f >= 180;
  const pulso = interpolate(f, [176, 182, 190], [1, 0.9, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const linea = entra(f, 190, 30);
  const activas = ['Meta Ads', 'Google Ads'];
  const respuesta = entra(f, 270, 20);
  const salida = sale(f, P2 - 20);
  return (
    <AbsoluteFill style={{ background: c.canvas, opacity: salida }}>
      <Capitulo texto={t.cap[1]} f={f} fin={P2} />
      <Leyenda style={{ position: 'absolute', left: 120, top: 150, fontSize: 52, fontWeight: 600, color: c.ink, letterSpacing: -1.2, ...sube(entra(f, 6) * sale(f, 450)) }}>{t.unaVez}</Leyenda>
      <Leyenda style={{ position: 'absolute', left: 120, top: 150, fontSize: 52, fontWeight: 600, color: c.ink, letterSpacing: -1.2, ...sube(entra(f, 470)) }}>{t.claudeAi}</Leyenda>

      <div style={{ position: 'absolute', left: 120, top: 270, width: 1060, borderRadius: 28, border: `1.5px solid ${c.hairline}`, background: c.canvas, boxShadow: '0 24px 60px rgba(11,13,14,0.08)', padding: 40, ...sube(entra(f, 20), 40) }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, paddingBottom: 26, borderBottom: `1.5px solid ${c.hairline}` }}>
          <div style={{ flex: 1, fontFamily: SANS, fontSize: 32, color: f < 40 ? c.text3 : c.ink, minHeight: 42 }}>
            {f < 40 ? t.placeholder : escribe(t.pregunta, f, 40, 1.4)}
          </div>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: enviado ? c.accentSoft : c.accent, transform: `scale(${pulso})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={enviado ? c.accent : c.canvas} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2 11 13" /><path d="M22 2 15 22 11 13 2 9 22 2z" /></svg>
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 26, alignItems: 'center' }}>
          {[
            [t.modelo, 'Claude', 110], [t.agente, t.agenteNombre, 128], [t.cuentas, 'KUBO · Meta Ads', 146], ['', 'KUBO · Google Ads', 156],
          ].map(([etq, val, d]) => (
            <span key={val as string} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, ...sube(entra(f, d as number, 12), 12) }}>
              {etq && <span style={{ fontFamily: MONO, fontSize: 22, color: c.text3, letterSpacing: 1 }}>{(etq as string).toUpperCase()}</span>}
              <Chip activo>{val}</Chip>
            </span>
          ))}
        </div>

        {f >= 190 && f < 280 && (
          <div style={{ marginTop: 34, fontFamily: MONO, fontSize: 24, color: c.text3, opacity: entra(f, 190, 10) * sale(f, 266, 10) }}>
            {t.consultando} {activas.slice(0, f < 225 ? 1 : 2).join(' · ')}{'.'.repeat(1 + (Math.floor(f / 8) % 3))}
          </div>
        )}

        {f >= 270 && (
          <div style={{ marginTop: 34, ...sube(respuesta, 20) }}>
            <div style={{ fontFamily: MONO, fontSize: 22, color: c.text3, letterSpacing: 1, marginBottom: 16 }}>{t.respuesta.toUpperCase()}</div>
            <div style={{ borderRadius: 16, border: `1.5px solid ${c.hairline}`, overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.15fr 1.25fr 1fr', background: c.surface, fontFamily: SANS, fontSize: 24, fontWeight: 600, color: c.text2 }}>
                {t.cols.map((h) => <div key={h} style={{ padding: '16px 22px' }}>{h}</div>)}
              </div>
              {t.filas.map((fila, i) => {
                const adelantada = i === 0;
                return (
                  <div key={fila[0]} style={{ display: 'grid', gridTemplateColumns: '1fr 1.15fr 1.25fr 1fr', borderTop: `1.5px solid ${c.hairline}`, fontFamily: SANS, fontSize: 28, color: c.ink, fontVariantNumeric: 'tabular-nums', opacity: entra(f, 284 + i * 14, 12) }}>
                    <div style={{ padding: '18px 22px', fontWeight: 600 }}>{fila[0]}</div>
                    <div style={{ padding: '18px 22px' }}>{fila[1]}</div>
                    <div style={{ padding: '18px 22px' }}>{fila[2]}</div>
                    <div style={{ padding: '12px 22px', display: 'flex', alignItems: 'center' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '6px 14px', borderRadius: 999, fontSize: 22, fontWeight: 600, color: adelantada ? c.warn : c.ok, background: adelantada ? c.warnBg : c.okBg }}>
                        {adelantada
                          ? <svg width="18" height="18" viewBox="0 0 24 24" fill={c.warn}><path d="M12 3 22 20H2z" /></svg>
                          : <svg width="18" height="18" viewBox="0 0 24 24" fill={c.ok}><circle cx="12" cy="12" r="9" /></svg>}
                        {fila[3]}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 22, fontFamily: SANS, fontSize: 28, color: c.ink, ...sube(entra(f, 330, 16), 10) }}>{t.sugerencia}</div>
            <div style={{ marginTop: 14, fontFamily: MONO, fontSize: 22, color: c.text3, opacity: entra(f, 340) }}>{t.ficticio}</div>
          </div>
        )}
      </div>

      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        {plataformas.map((p, i) => {
          if (!activas.includes(p)) return null;
          const y = 330 + i * 112;
          const x1 = 1180, x2 = 1440;
          const largo = Math.hypot(x2 - x1, y - 420);
          return <path key={p} d={`M ${x1} 420 C ${x1 + 130} 420, ${x2 - 130} ${y}, ${x2} ${y}`} fill="none" stroke={c.accent} strokeWidth={3} strokeDasharray={largo * 1.3} strokeDashoffset={largo * 1.3 * (1 - linea)} />;
        })}
      </svg>
      <div style={{ position: 'absolute', left: 1250, top: 344, fontFamily: MONO, fontSize: 22, color: c.accent, letterSpacing: 2, opacity: linea }}>MCP</div>
      <div style={{ position: 'absolute', left: 1440, top: 296, display: 'flex', flexDirection: 'column', gap: 40 }}>
        {plataformas.map((p, i) => {
          const on = activas.includes(p) && f >= 200 + activas.indexOf(p) * 30;
          return (
            <div key={p} style={{
              width: 360, height: 72, borderRadius: 18, display: 'flex', alignItems: 'center', padding: '0 26px', gap: 14,
              border: `1.5px solid ${on ? c.accent : c.hairline}`, background: on ? c.accentSoft : c.surface,
              fontFamily: SANS, fontSize: 26, fontWeight: 600, color: on ? c.accent : c.text3, ...sube(entra(f, 40 + i * 6, 14), 16),
            }}>
              <span style={{ width: 12, height: 12, borderRadius: 6, background: on ? c.accent : c.hairlineStrong }} />
              {p}
            </div>
          );
        })}
      </div>

    </AbsoluteFill>
  );
}

function Resultado({ t }: { t: (typeof textos)[Lang] }) {
  const f = useCurrentFrame();
  const cierre = entra(f, 300, 24);
  return (
    <AbsoluteFill style={{ background: c.canvas }}>
      <Capitulo texto={t.cap[2]} f={f} fin={300} />
      <div style={{ opacity: 1 - cierre }}>
        <div style={{ position: 'absolute', left: 120, top: 230, right: 120, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 60 }}>
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
        <div style={{ position: 'absolute', left: 120, top: 640, fontFamily: MONO, fontSize: 26, color: c.text3, opacity: entra(f, 120) }}>{t.fuente}</div>
        <div style={{ position: 'absolute', left: 120, top: 760, right: 300, fontFamily: SANS, fontSize: 48, lineHeight: 1.2, letterSpacing: -1, color: c.ink, paddingLeft: 36, borderLeft: `4px solid ${c.accent}`, ...sube(entra(f, 170, 20)) }}>
          “{t.cita}”
        </div>
      </div>
      <AbsoluteFill style={{ justifyContent: 'center', padding: '0 120px', opacity: cierre }}>
        <div style={{ fontFamily: SANS, fontSize: 84, fontWeight: 600, letterSpacing: -2.4, color: c.ink, ...sube(cierre) }}>{t.cierre1}</div>
        <div style={{ fontFamily: SANS, fontSize: 40, color: c.text2, marginTop: 28, ...sube(entra(f, 318, 20)) }}>{t.cierre2}</div>
        <div style={{ fontFamily: MONO, fontSize: 26, color: c.accent, marginTop: 70, letterSpacing: 1, ...sube(entra(f, 340, 20)) }}>{t.firma}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

export const Osaka = ({ lang }: { lang: Lang }) => {
  const t = textos[lang];
  return (
    <AbsoluteFill style={{ background: c.canvas }}>
      <Sequence durationInFrames={P1}><Problema t={t} /></Sequence>
      <Sequence from={P1} durationInFrames={P2}><MomentoClave t={t} /></Sequence>
      <Sequence from={P1 + P2} durationInFrames={P3}><Resultado t={t} /></Sequence>
    </AbsoluteFill>
  );
};
