// Repetición de una corrida grabada. Todo el texto y los estados se leen del DOM que renderizó el
// servidor, así que la isla no puede contradecir las trazas. Los hilos son SVG dentro de <main>:
// se mueven con la página sin ningún retraso, cosa que un canvas fijo no logra en iOS.
// Sin dependencias: SVG, Web Animations y nada más.

const SVG = 'http://www.w3.org/2000/svg';
type Estado = 'con_evidencia' | 'parcial' | 'sin_evidencia';
type Pt = [number, number];
interface Hilo { el: SVGPathElement; ruta: () => string; fila: number; dest?: HTMLElement; extra?: SVGElement }

const $ = <T extends Element>(p: ParentNode, s: string) => p.querySelector<T>(s);
const $$ = <T extends Element>(p: ParentNode, s: string) => [...p.querySelectorAll<T>(s)];

/** Polilínea ortogonal con esquinas redondeadas. */
const trazo = (pts: Pt[], r = 6) => {
  let d = `M${pts[0]![0]} ${pts[0]![1]}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [a, b, c] = [pts[i - 1]!, pts[i]!, pts[i + 1]!];
    const r1 = Math.min(r, Math.hypot(b[0] - a[0], b[1] - a[1]) / 2, Math.hypot(c[0] - b[0], c[1] - b[1]) / 2);
    const u = (p: Pt) => { const l = Math.hypot(p[0] - b[0], p[1] - b[1]) || 1; return [b[0] + ((p[0] - b[0]) / l) * r1, b[1] + ((p[1] - b[1]) / l) * r1]; };
    const [x1, y1] = u(a); const [x2, y2] = u(c);
    d += `L${x1} ${y1}Q${b[0]} ${b[1]} ${x2} ${y2}`;
  }
  const z = pts.at(-1)!;
  return `${d}L${z[0]} ${z[1]}`;
};

/** Resorte amortiguado precalculado: `linear()` no existe en iOS 16. */
const resorte = (desde: number, n = 18, amort = 4.6, frec = 15) =>
  Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n;
    return desde * Math.exp(-amort * t) * Math.cos(frec * t) * (i === n ? 0 : 1);
  });

export function arrancar(root: HTMLElement) {
  const main = root.closest('main') as HTMLElement;
  const live = $<HTMLElement>(root, '[data-live]')!;
  const txt = JSON.parse(live.dataset.strings!) as Record<'play' | 'pause' | 'again' | 'back', string>;
  const quieto = matchMedia('(prefers-reduced-motion: reduce)');

  main.style.position = 'relative';
  const svg = document.createElementNS(SVG, 'svg');
  svg.setAttribute('class', 'replay-threads');
  svg.setAttribute('aria-hidden', 'true');
  main.append(svg);

  // ---------- Reloj virtual: esperas que se pausan y una sola rAF, viva solo mientras haga falta ----------
  let token = 0;
  let pausado = false;
  let esperas: { resta: number; listo: () => void; cond?: () => boolean; token: number }[] = [];
  const vivas = new Set<Animation>();
  let raf = 0;
  let previo = 0;
  const latir = (t: number) => {
    const dt = Math.min(t - previo, 100);
    previo = t;
    if (!pausado) {
      esperas = esperas.filter((w) => {
        w.resta -= dt;
        if (w.resta > 0) return true;
        if (w.cond && !w.cond()) { w.resta = 90; return true; }
        w.listo();
        return false;
      });
    }
    raf = esperas.length ? requestAnimationFrame(latir) : 0;
  };
  const esperar = (ms: number, cond?: () => boolean) => new Promise<void>((listo) => {
    esperas.push({ resta: ms, listo, cond, token });
    if (!raf) { previo = performance.now(); raf = requestAnimationFrame(latir); }
  });
  const animar = (el: Element, kf: Keyframe[], o: KeyframeAnimationOptions) => {
    const a = el.animate(kf, o);
    vivas.add(a);
    a.finished.catch(() => {}).finally(() => vivas.delete(a));
    if (pausado) a.pause();
    return a;
  };

  // ---------- Geometría ----------
  const caja = (el: Element) => {
    const r = el.getBoundingClientRect(); const m = main.getBoundingClientRect();
    return { l: r.left - m.left, t: r.top - m.top, r: r.right - m.left, b: r.bottom - m.top, y: r.top + r.height / 2 - m.top, x: r.left + r.width / 2 - m.left, h: r.height, w: r.width, top: r.top };
  };
  const altoNav = () => $<HTMLElement>(document, '.nav')?.offsetHeight ?? 72;
  const visible = (el: Element, margen = 72) => el.getBoundingClientRect().top < innerHeight - margen;

  // ---------- Estado de una corrida ----------
  let panel = $<HTMLElement>(root, '[data-replay-panel]:not([hidden])')!;
  let hilos: Hilo[] = [];
  let carriles = new Map<string, number>();
  let saltoHasta = -1;
  let enCurso = false;

  const filas = () => $$<HTMLElement>(panel, '[data-row]');
  const consola = () => $<HTMLElement>(panel, '[data-console]')!;
  const paso = (s: string) => { $(consola(), '[data-step]')!.textContent = s; };
  const pasos = () => $$<HTMLElement>(panel, '.steps .st').map((e) => e.textContent ?? '');
  const reloj = (ms: number) => { $(consola(), '[data-clock]')!.textContent = `${(ms / 1000).toFixed(1)} s`; };
  const modo = (m: 'playing' | 'paused' | 'ended') => {
    const c = consola();
    c.dataset.mode = m;
    $(c, '[data-toggle]')!.setAttribute('aria-label', m === 'playing' ? txt.pause : m === 'paused' ? txt.play : txt.again);
  };
  const decir = (s: string) => { live.textContent = s; };
  const etiqueta = (f: HTMLElement) => $(f, '.ask .chip')?.textContent?.trim() ?? '';
  const recuento = () => $$<HTMLElement>(panel, '.v').map((v) => `${$(v, '.vn')!.textContent} ${$(v, 'dt')!.textContent!.trim()}`).join(', ');

  const carrilX = (dest: string) => {
    const izq = caja(panel).l;
    return Math.max(2.5, Math.round(izq - 6 - (carriles.get(dest) ?? 0) * 3.25) + 0.5); // alineado al píxel para que todos se vean igual
  };

  /** Dónde y cómo entra un hilo en su prueba real. */
  const entrada = (dest: HTMLElement, x: number): Pt[] => {
    const dot = $(dest, '.t-dot');
    if (dot) {
      const c = caja(dot);
      if (c.l - x > 40) return [[x, c.t - 20], [c.x, c.t - 20], [c.x, c.t - 1]]; // en la fila horizontal entra desde arriba, sin cruzar otros años
      return [[x, c.y], [c.l - 1, c.y]];
    }
    const cifra = $(dest, '.num-v');
    if (cifra) {
      const n = caja(dest); const c = caja(cifra);
      if (c.l - x > 40) return [[x, n.t], [c.l + 12, n.t], [c.l + 12, c.t - 2]]; // recorre el filete superior de la fila de cifras
      return [[x, c.y], [c.l - 2, c.y]];
    }
    const t = caja(dest);
    return [[x, t.t + 44], [t.l, t.t + 44]];
  };

  const crearPath = (clase: string, ruta: () => string, fila: number, dest?: HTMLElement) => {
    const el = document.createElementNS(SVG, 'path');
    el.setAttribute('class', clase);
    el.setAttribute('d', ruta());
    el.dataset.fila = String(fila);
    svg.append(el);
    const h: Hilo = { el, ruta, fila, dest };
    hilos.push(h);
    return h;
  };

  const planear = (f: HTMLElement, i: number): Hilo[] => {
    const estado = f.dataset.estado as Estado;
    const chip = $<HTMLElement>(f, '.ask .chip')!;
    const links = $$<HTMLAnchorElement>(f, '.to');
    if (!links.length) {
      // Sin cita: el hilo sale, no encuentra nada y se deshilacha. No llega a ningún lado porque no hay a dónde.
      const ruta = () => {
        const c = caja(chip); const x = c.r + 40;
        return `M${c.r + 4} ${c.y}H${x}m0 0q8 -1 14 -7m-14 7q9 0 16 0m-16 0q8 1 14 7`;
      };
      return [crearPath(`${estado} frayed`, ruta, i)];
    }
    return links.map((a, n) => {
      const dest = a.dataset.dest ? document.getElementById(`prueba-${a.dataset.dest}`) ?? undefined : undefined;
      if (dest) {
        const key = a.dataset.dest!;
        const ruta = () => {
          const c = caja(chip); const x = carrilX(key);
          return trazo([[c.l - 2, c.y], [x, c.y], ...entrada(dest, x)]);
        };
        return crearPath(estado, ruta, i, dest);
      }
      // Cita sin elemento en esta página: sale por el borde, rumbo a su URL.
      const ruta = () => {
        const c = caja(chip); const fy = caja(f).t + 1 + n * 3; const m = main.getBoundingClientRect().width;
        return trazo([[c.r + 3, c.y], [c.r + 14, c.y], [c.r + 14, fy], [m, fy]]);
      };
      return crearPath(estado, ruta, i);
    });
  };

  const prepararCarriles = () => {
    const claves = new Set<string>();
    $$<HTMLAnchorElement>(panel, '.to[data-dest]').forEach((a) => { if (document.getElementById(`prueba-${a.dataset.dest}`)) claves.add(a.dataset.dest!); });
    const orden = [...claves].sort((a, b) => caja(document.getElementById(`prueba-${a}`)!).t - caja(document.getElementById(`prueba-${b}`)!).t);
    carriles = new Map(orden.map((k, i) => [k, i]));
  };

  const dibujar = (h: Hilo, ms: number) => {
    if (quieto.matches || ms === 0) return;
    const l = h.el.getTotalLength();
    h.el.style.strokeDasharray = `${l}`;
    h.el.style.strokeDashoffset = `${l}`;
    const a = animar(h.el, [{ strokeDashoffset: l }, { strokeDashoffset: 0 }], { duration: ms, easing: 'cubic-bezier(.5, 0, .1, 1)', fill: 'forwards' });
    a.finished.then(() => { h.el.style.strokeDasharray = ''; h.el.style.strokeDashoffset = ''; a.cancel(); }).catch(() => {});
  };

  const citar = (d: HTMLElement) => { d.dataset.cited = ''; };

  const resolver = (i: number, animado: boolean) => {
    const f = filas()[i]!;
    if (f.hasAttribute('data-done')) return;
    delete f.dataset.scan;
    f.dataset.read = '';
    f.dataset.done = '';
    $(consola(), `[data-tick="${i}"]`)?.setAttribute('data-on', '');
    const hs = planear(f, i);
    const llano = quieto.matches || !animado;
    if (!llano) {
      animar($(f, '.ask .chip')!, [
        { opacity: 0, transform: 'scale(1.4)', filter: 'blur(3px)' },
        { opacity: 1, transform: 'scale(1)', filter: 'blur(0)' },
      ], { duration: 280, easing: 'cubic-bezier(.16, 1, .3, 1)' });
    }
    hs.forEach((h) => {
      if (h.dest) citar(h.dest);
      dibujar(h, llano ? 0 : h.dest ? 900 : 420);
    });
  };

  const limpiar = () => {
    token++;
    esperas = [];
    vivas.forEach((a) => a.cancel());
    vivas.clear();
    svg.replaceChildren();
    delete svg.dataset.hot;
    hilos = [];
    saltoHasta = -1;
    pausado = false;
    cerrarDock();
    $$<HTMLElement>(document, '[data-cited]').forEach((d) => { delete d.dataset.cited; delete d.dataset.spot; });
  };

  const empujables = () => $$<HTMLElement>(panel, '.trap mark, .trap .tnote');

  const armar = () => {
    panel.dataset.run = '';
    delete panel.dataset.settled;
    delete panel.dataset.caught;
    delete panel.dataset.attack;
    filas().forEach((f) => { delete f.dataset.done; delete f.dataset.read; delete f.dataset.scan; });
    $$<HTMLElement>(panel, '.tick').forEach((t) => t.removeAttribute('data-on'));
    // La orden ocupa el lugar del aviso hasta que el aviso cae y la empuja. Sin tocar el layout.
    const caught = $<HTMLElement>(panel, '.caught');
    if (caught) empujables().forEach((e) => { e.style.transform = `translateY(${-(caught.offsetHeight + 8)}px)`; });
    prepararCarriles();
  };

  /** Estado final sin movimiento: la misma información que la repetición. */
  const finalEstatico = () => {
    armar();
    empujables().forEach((e) => { e.style.transform = ''; });
    panel.dataset.settled = '';
    panel.dataset.caught = '';
    filas().forEach((_, i) => resolver(i, false));
    const p = pasos();
    paso(p.at(-1) ?? '');
    reloj(Number(panel.dataset.lat));
    modo('ended');
    enCurso = false;
  };

  // ---------- La trampa: la orden intenta alcanzar cada requisito y se corta ----------
  const trampa = async (t: number) => {
    const mark = $<HTMLElement>(panel, '.trap mark');
    if (!mark || !$(panel, '.caught')) return;
    await esperar(150, () => visible(mark, 120));
    if (t !== token) return;
    panel.dataset.attack = '';
    const piezas = filas().map((f) => {
      const chip = $<HTMLElement>(f, '.ask .chip')!;
      const m = caja(mark); const c = caja(chip); const x = Math.max(4, caja(panel).l - 8); const corte = c.l + 2;
      const cuerpo = document.createElementNS(SVG, 'path');
      cuerpo.setAttribute('class', 'attack');
      cuerpo.setAttribute('d', trazo([[m.l, m.b - 10], [x, m.b - 10], [x, c.y], [corte, c.y]]));
      const cola = document.createElementNS(SVG, 'path');
      cola.setAttribute('class', 'attack');
      cola.setAttribute('d', `M${corte} ${c.y}H${c.r}`);
      const puerta = document.createElementNS(SVG, 'path');
      puerta.setAttribute('class', 'gate');
      puerta.setAttribute('d', `M${corte} ${c.y - 9}V${c.y + 9}`);
      puerta.style.opacity = '0';
      cola.style.opacity = '0';
      svg.append(cuerpo, cola, puerta);
      return { cuerpo, cola, puerta };
    });
    // Salen a la vez y con prisa: una orden, todos los requisitos.
    piezas.forEach(({ cuerpo }, i) => {
      const l = cuerpo.getTotalLength();
      cuerpo.style.strokeDasharray = `${l}`;
      animar(cuerpo, [{ strokeDashoffset: l }, { strokeDashoffset: 0 }], { duration: 620 + i * 70, easing: 'cubic-bezier(.6, 0, .2, 1)', fill: 'forwards' });
    });
    await esperar(760 + piezas.length * 70);
    if (t !== token) return;
    // El corte. La cola cae con gravedad; el cuerpo retrocede hasta la orden.
    piezas.forEach(({ cuerpo, cola, puerta }) => {
      puerta.style.opacity = '1';
      puerta.style.transformBox = 'fill-box';
      puerta.style.transformOrigin = 'center';
      animar(puerta, [{ transform: 'scaleY(.2)' }, { transform: 'scaleY(1.25)' }, { transform: 'scaleY(1)' }], { duration: 220, easing: 'ease-out' });
      cola.style.opacity = '1';
      cola.style.transformBox = 'fill-box';
      cola.style.transformOrigin = 'left center';
      animar(cola, [{ transform: 'translateY(0)', opacity: 1 }, { transform: 'translateY(34px) rotate(5deg)', opacity: 0 }], { duration: 520, easing: 'cubic-bezier(.5, 0, .9, .5)', fill: 'forwards' });
      const l = cuerpo.getTotalLength();
      animar(cuerpo, [{ strokeDashoffset: 0 }, { strokeDashoffset: l }], { duration: 640, delay: 160, easing: 'cubic-bezier(.2, 0, 0, 1)', fill: 'forwards' });
    });
    await esperar(760);
    if (t !== token) return;
    delete panel.dataset.attack;
    panel.dataset.caught = '';
    const caught = $<HTMLElement>(panel, '.caught')!;
    animar(caught, [{ transform: 'translateY(-14px) scale(1.03)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 300, easing: 'cubic-bezier(.16, 1, .3, 1)' });
    const hueco = caught.offsetHeight + 8;
    empujables().forEach((e) => {
      e.style.transform = '';
      animar(e, resorte(-hueco, 16, 6, 16).map((y) => ({ transform: `translateY(${y.toFixed(1)}px)` })), { duration: 620, easing: 'linear' });
    });
    decir(caught.textContent?.trim() ?? '');
    await esperar(420);
    if (t !== token) return;
    piezas.forEach(({ puerta, cuerpo, cola }) => {
      animar(puerta, [{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: 'forwards' }).finished.then(() => { puerta.remove(); cuerpo.remove(); cola.remove(); }).catch(() => {});
    });
  };

  // ---------- El recuento cae con peso ----------
  const asentar = (animado: boolean) => {
    panel.dataset.settled = '';
    decir(recuento());
    if (!animado || quieto.matches) return;
    $$<HTMLElement>(panel, '.v').forEach((v, i) => {
      const n = $<HTMLElement>(v, '.vn')!;
      const ys = resorte(-64);
      n.animate(ys.map((y, k) => {
        // Se aplasta justo al tocar el piso, más cuanto más rápido llega.
        const golpe = k > 0 ? Math.min(Math.abs(y - ys[k - 1]!) / 90, 0.14) : 0;
        return { transform: `translateY(${y.toFixed(2)}px) scale(${(1 + golpe).toFixed(3)}, ${(1 - golpe).toFixed(3)})`, opacity: k === 0 ? 0 : 1 };
      }), { duration: 900, delay: i * 80, easing: 'linear', fill: 'backwards' });
      $(v, 'dt')!.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 300, delay: 300 + i * 80, easing: 'ease-out', fill: 'backwards' });
    });
    // El impacto se transmite a lo que está alrededor.
    const ys = resorte(5, 12, 5.5, 18).map((y) => ({ transform: `translateY(${Math.abs(y).toFixed(2)}px)` }));
    [$(panel, '.reqs > li:last-child'), $(panel, '.proof')].forEach((el) => el?.animate(ys, { duration: 520, delay: 180, easing: 'linear' }));
  };

  // ---------- La corrida ----------
  const correr = async (inicial = false) => {
    limpiar();
    const t = token;
    enCurso = true;
    armar();
    const p = pasos();
    const total = Number(panel.dataset.lat);
    const lats = $$<HTMLElement>(panel, '.steps .sm').map((e) => parseFloat(e.textContent!.split('·')[1] ?? '0') * 1000);
    const extraer = lats[0] ?? 0;
    modo('playing');
    paso(p[0] ?? '');
    reloj(0);
    if (inicial) { await esperar(60, () => visible(consola(), 40)); if (t !== token) return; }

    await trampa(t);
    if (t !== token) return;

    // Extraer: lee los requisitos.
    const fs = filas();
    for (let i = 0; i < fs.length; i++) {
      fs[i]!.dataset.read = '';
      await esperar(55);
      if (t !== token) return;
    }
    reloj(extraer);
    paso(p[1] ?? '');

    // Evaluar: uno por uno. Si la fila no se ve, espera a que llegues; si ya la pasaste, no te detiene.
    for (let i = 0; i < fs.length; i++) {
      const f = fs[i]!;
      if (i > saltoHasta) {
        await esperar(40, () => saltoHasta >= i || visible(f, 96));
        if (t !== token) return;
      }
      const animado = i > saltoHasta && f.getBoundingClientRect().bottom > altoNav();
      if (animado) { f.dataset.scan = ''; await esperar(300); if (t !== token) return; }
      resolver(i, animado);
      decir(`${$(f, '.rt')!.textContent?.trim()}: ${etiqueta(f)}`);
      if (animado && i > saltoHasta) { await esperar(f.querySelector('.to') ? 620 : 360); if (t !== token) return; }
    }

    // Comprobar cada cita. El reloj solo muestra tiempos grabados: la evaluación fue una sola llamada,
    // así que no hay tiempo por requisito que mostrar.
    paso(p[2] ?? '');
    reloj(total);
    if (hilos.length) {
      svg.animate([{ opacity: 1 }, { opacity: .35 }, { opacity: 1 }], { duration: 420, easing: 'ease-in-out' });
      await esperar(520);
      if (t !== token) return;
    }

    const v = $<HTMLElement>(panel, '[data-verdict]')!;
    await esperar(60, () => visible(v, 110));
    if (t !== token) return;
    reloj(total);
    asentar(true);
    modo('ended');
    enCurso = false;
  };

  const verTodo = () => {
    limpiar();
    finalEstatico();
    asentar(true);
  };

  // ---------- Seguir un hilo ----------
  let dock: HTMLElement | null = null;
  let vuelta: { a: HTMLElement; dest: HTMLElement } | null = null;
  function cerrarDock() {
    dock?.remove(); dock = null;
    if (vuelta) delete vuelta.dest.dataset.spot;
    removeEventListener('scroll', vigilarDock);
    vuelta = null;
  }
  function vigilarDock() {
    if (!vuelta) return;
    const r = vuelta.dest.getBoundingClientRect();
    if (r.bottom < -innerHeight || r.top > innerHeight * 2) cerrarDock();
  }
  const conducta = (): ScrollBehavior => (quieto.matches ? 'auto' : 'smooth');
  const seguir = (a: HTMLAnchorElement) => {
    const dest = document.getElementById(`prueba-${a.dataset.dest}`);
    if (!dest) return;
    const fila = a.closest<HTMLElement>('[data-row]')!;
    const i = filas().indexOf(fila);
    if (enCurso) saltoHasta = Math.max(saltoHasta, i);
    resolver(i, false);
    cerrarDock();
    dest.dataset.spot = '';
    vuelta = { a, dest };
    dest.scrollIntoView({ behavior: conducta(), block: 'center' });
    dock = document.createElement('div');
    dock.className = 'replay-dock';
    const q = document.createElement('p');
    q.id = 'replay-dock-cita';
    q.textContent = a.dataset.quote ?? '';
    const s = document.createElement('small');
    s.textContent = a.dataset.fuente ?? '';
    q.append(s);
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = txt.back;
    b.setAttribute('aria-describedby', q.id);
    b.addEventListener('click', volver);
    dock.append(q, b);
    dock.addEventListener('keydown', (e) => { if (e.key === 'Escape') volver(); });
    root.append(dock);
    b.focus({ preventScroll: true });
    setTimeout(() => addEventListener('scroll', vigilarDock, { passive: true }), 900);
  };
  function volver() {
    const a = vuelta?.a;
    cerrarDock();
    if (!a) return;
    a.closest('[data-row]')!.scrollIntoView({ behavior: conducta(), block: 'center' });
    a.focus({ preventScroll: true });
  }

  // ---------- Controles ----------
  root.addEventListener('replay:select', () => {
    panel = $<HTMLElement>(root, '[data-replay-panel]:not([hidden])')!;
    limpiar();
    if (quieto.matches) { finalEstatico(); decir(recuento()); }
    else requestAnimationFrame(() => void correr());
  });

  root.addEventListener('click', (e) => {
    const el = e.target as Element;
    const to = el.closest<HTMLAnchorElement>('.to[data-dest]');
    // Primero se pinta la respuesta al toque; medir, desplazar y mover el foco van después (INP).
    if (to) { e.preventDefault(); requestAnimationFrame(() => setTimeout(() => seguir(to), 0)); return; }
    if (el.closest('[data-toggle]')) {
      const m = consola().dataset.mode;
      if (m === 'ended') { panel.scrollIntoView({ behavior: conducta(), block: 'start' }); void correr(); return; } // desde el principio: la trampa no puede pasar fuera de vista
      pausado = m === 'playing';
      vivas.forEach((a) => (pausado ? a.pause() : a.play()));
      modo(pausado ? 'paused' : 'playing');
      return;
    }
    if (el.closest('[data-skip]')) { verTodo(); return; }
    const tick = el.closest<HTMLElement>('[data-tick]');
    if (tick) {
      const i = Number(tick.dataset.tick);
      if (enCurso) {
        saltoHasta = Math.max(saltoHasta, i);
        for (let n = 0; n <= i; n++) resolver(n, false);
        if (pausado) { pausado = false; vivas.forEach((a) => a.play()); modo('playing'); }
      }
      filas()[i]?.scrollIntoView({ behavior: conducta(), block: 'center' });
      resaltar(i);
    }
  });

  // Pasar por un requisito resalta su hilo y apaga los demás.
  const resaltar = (i: number | null) => {
    if (i === null) { delete svg.dataset.hot; $$<SVGPathElement>(svg, 'path[data-hot]').forEach((p) => delete p.dataset.hot); return; }
    svg.dataset.hot = '';
    hilos.forEach((h) => { if (h.fila === i) h.el.dataset.hot = ''; else delete h.el.dataset.hot; });
  };
  const sobreFila = (e: Event) => {
    const f = (e.target as Element).closest?.<HTMLElement>('[data-row]');
    resaltar(f ? filas().indexOf(f) : null);
  };
  root.addEventListener('pointerover', (e) => { if ((e as PointerEvent).pointerType === 'mouse') sobreFila(e); }, { passive: true });
  root.addEventListener('pointerleave', () => resaltar(null), { passive: true });
  root.addEventListener('focusin', sobreFila);

  // ---------- Reubicar hilos si cambia la página: fuentes, <details>, rotación ----------
  let pendiente = 0;
  new ResizeObserver(() => {
    if (pendiente) return;
    pendiente = requestAnimationFrame(() => {
      pendiente = 0;
      hilos.forEach((h) => {
        if (h.el.style.strokeDasharray) return; // se está dibujando
        h.el.setAttribute('d', h.ruta());
      });
    });
  }).observe(main);

  quieto.addEventListener('change', () => { if (quieto.matches && enCurso) verTodo(); });

  root.dataset.ready = '';

  // Primera corrida: solo si la tabla aún no se ve, para no borrar algo que ya están leyendo.
  const primera = filas()[0];
  if (primera && !quieto.matches && primera.getBoundingClientRect().top > innerHeight) void correr(true);
  else finalEstatico();
}
