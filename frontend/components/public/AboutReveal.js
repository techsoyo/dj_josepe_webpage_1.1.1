"use client";

import { useEffect, useRef, useState } from "react";

/**
 * AboutReveal.js
 * - Detecta si #dj / #josepe están dentro de un contexto fixed y usa un fallback por scroll.
 * - Superpone la mosaic sobre el viewport (para que "rellene" el hueco del video).
 * - Usa JS para stagger, micro-parallax, typing y contadores.
 *
 * Integración:
 * 1) Crea este archivo en components/public/AboutReveal.js
 * 2) En tu página (donde tienes <VideoSection />), importa:
 *    import AboutReveal from '../../../components/public/AboutReveal';
 * 3) Reemplaza tu antigua <section className="about-section">...</section> por <AboutReveal />
 * 4) Asegúrate de conservar los IDs: <h5 id="dj"> y <h5 id="josepe"> en tu VideoSection.
 */

export default function AboutReveal() {
  const rootRef = useRef(null);
  const tilesRef = useRef([]);
  const typedRef = useRef(null);
  const [revealed, setRevealed] = useState(false);
  const prefersReduce = typeof window !== "undefined" && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // stats refs
  const c1 = useRef(null), c2 = useRef(null), c3 = useRef(null), c4 = useRef(null);
  const stats = [
    { ref: c1, to: 50, suffix: "+" },
    { ref: c2, to: 2, suffix: " meses" },
    { ref: c3, to: 80, suffix: " min" },
    { ref: c4, to: 15000, suffix: "+" },
  ];

  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
  function animateCount(el, to, duration = 1200, suffix = "") {
    if (!el) return;
    if (prefersReduce) { el.textContent = `${to}${suffix}`; return; }
    const start = performance.now(); const initial = 0;
    const step = (ts) => {
      const elapsed = ts - start;
      const progress = Math.min(1, elapsed / duration);
      const current = Math.floor(initial + (to - initial) * easeOutCubic(progress));
      el.textContent = `${current}${suffix}`;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = `${to}${suffix}`;
    };
    requestAnimationFrame(step);
  }
  function runTyping(el, text, speed = 40) {
    if (!el) return;
    if (prefersReduce) { el.textContent = text; return; }
    el.textContent = ""; let i = 0;
    const run = () => {
      if (i <= text.length) { el.textContent = text.slice(0, i); i++; setTimeout(run, speed + Math.random() * 25); }
    };
    run();
  }

  // ---- Observer / fallback (parche para fixed parents) ----
  useEffect(() => {
    const selectors = ["#dj", "#josepe"];
    const els = selectors.map(s => document.querySelector(s)).filter(Boolean);

    // helper: check if element or any ancestor is fixed
    const isInFixedContext = (el) => {
      let node = el;
      while (node && node !== document.documentElement) {
        const pos = window.getComputedStyle(node).position;
        if (pos === "fixed") return true;
        node = node.parentElement;
      }
      return false;
    };

    if (els.length === 0) {
      // no triggers found — fallback to a scroll threshold
      const onScroll = () => { if (window.scrollY > window.innerHeight * 0.55) setRevealed(true); };
      window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
      return () => window.removeEventListener("scroll", onScroll);
    }

    // If any observed element lives inside a fixed container => use scroll fallback
    const anyFixed = els.some(el => isInFixedContext(el));
    if (anyFixed) {
      const onScroll = () => {
        // umbral ajustable: 0.9 = reveal near end of viewport scroll; 0.55 = earlier
        if (window.scrollY > window.innerHeight * 0.9) setRevealed(true);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
      return () => window.removeEventListener("scroll", onScroll);
    }

    // otherwise use IntersectionObserver to detect when both are out of view
    const visibility = new Map();
    els.forEach(el => visibility.set(el, true));

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => visibility.set(entry.target, entry.isIntersecting));
      const anyVisible = Array.from(visibility.values()).some(v => v === true);
      if (!anyVisible) setTimeout(() => setRevealed(true), 80);
    }, { threshold: 0.01 });

    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // ---- init tiles vars for staggered entry ----
  useEffect(() => {
    const tiles = tilesRef.current;
    if (!tiles || tiles.length === 0) return;
    tiles.forEach((t, i) => {
      if (!t) return;
      const ty = 28 + Math.floor(Math.random() * 96); // px
      const rot = ((Math.random() - 0.5) * 14).toFixed(2) + "deg";
      const delay = 80 + i * 50 + Math.floor(Math.random() * 120);
      t.style.setProperty("--init-ty", `${ty}px`);
      t.style.setProperty("--init-rot", rot);
      t.style.setProperty("--delay", `${delay}ms`);
      t.style.willChange = "transform, opacity";
    });
  }, []);

  // ---- on reveal: run typing + counters ----
  useEffect(() => {
    if (!revealed) return;
    runTyping(typedRef.current, "Sobre Mí", 42);
    stats.forEach((s, idx) => {
      setTimeout(() => animateCount(s.ref.current, s.to, 1100 + idx * 200, s.suffix), 520 + idx * 160);
    });
  }, [revealed]);

  // ---- micro parallax for tiles ----
  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReduce) return;
    let raf = null;
    const onMove = (e) => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = root.getBoundingClientRect();
        const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / rect.width;
        const dy = (e.clientY - cy) / rect.height;
        tilesRef.current.forEach((t, idx) => {
          if (!t) return;
          const depth = 6 + (idx % 7);
          const tx = dx * depth * 8;
          const ty = dy * depth * 6;
          if (revealed) {
            t.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
          } else {
            t.style.transform = `translate3d(${tx}px, calc(var(--init-ty, 40px) + ${ty}px), 0) rotate(var(--init-rot, 6deg))`;
          }
        });
      });
    };
    const onLeave = () => {
      tilesRef.current.forEach((t) => {
        if (!t) return;
        t.style.transform = revealed ? `translate3d(0,0,0)` : ``;
      });
    };
    root.addEventListener("mousemove", onMove);
    root.addEventListener("mouseleave", onLeave);
    return () => {
      root.removeEventListener("mousemove", onMove);
      root.removeEventListener("mouseleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [revealed, prefersReduce]);

  const tileCount = 14;

  return (
    <section
      ref={rootRef}
      className={`about-wrap ${revealed ? "is-revealed" : ""}`}
      aria-labelledby="sobremi-heading"
      style={{
        position: 'relative',
        zIndex: 5,
        marginTop: '-100vh',
        paddingTop: '100vh',
        overflow: 'visible',
        color: 'white',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.24), rgba(0,0,0,0.12))'
      }}
    >
      <div
        className="mosaic"
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: '2%',
          right: '2%',
          top: '6%',
          height: '68%',
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '12px',
          padding: '18px',
          pointerEvents: 'none',
          zIndex: 6,
          opacity: revealed ? 1 : 0,
          transform: revealed ? 'translateY(0) scale(1)' : 'translateY(18px) scale(1.02)',
          transition: 'opacity 600ms ease, transform 700ms cubic-bezier(.16,.95,.24,1)'
        }}
      >
        {Array.from({ length: tileCount }).map((_, i) => (
          <span
            key={i}
            ref={el => (tilesRef.current[i] = el)}
            className="tile"
            role="presentation"
            style={{
              height: '72px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.10), rgba(255,255,255,0.03))',
              boxShadow: '0 10px 26px rgba(0,0,0,0.45) inset',
              transform: revealed ? 'translate3d(0,0,0) rotate(0deg)' : `translateY(var(--init-ty, 40px)) rotate(var(--init-rot, 6deg))`,
              opacity: revealed ? 0.20 : 0.06,
              transition: revealed ? 'transform 850ms cubic-bezier(.16,.95,.24,1), opacity 650ms ease' : 'none',
              transitionDelay: revealed ? `var(--delay, 0ms)` : 'none',
              willChange: 'transform, opacity'
            }}
          />
        ))}
      </div>

      <div
        className="content"
        style={{
          position: 'relative',
          zIndex: 8,
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '48px 20px 100px 20px',
          backdropFilter: 'blur(6px) saturate(110%)'
        }}
      >
        <h2
          id="sobremi-heading"
          className="heading"
          style={{
            fontSize: '2.6rem',
            margin: '6px 0 18px 0',
            minHeight: '1.4em',
            fontWeight: 700,
            letterSpacing: '0.4px',
            color: '#fff',
            opacity: revealed ? 1 : 0,
            transform: revealed ? 'translateY(0)' : 'translateY(14px)',
            transition: 'all 700ms ease'
          }}
        >
          <span ref={typedRef} />
        </h2>

        <div className="intro">
          <p><strong>Hola, soy José Miguel Serra — Josepe.</strong> En la escena electrónica de Barcelona combino estrategia, técnica y sensibilidad musical para construir sesiones con propósito y pulso.</p>
        </div>

        <div className="timeline">
          <article>
            <h3>Mi estilo musical</h3>
            <ol>
              <li><strong>🏠 House clásico (2022–2023)</strong> — grooves entre 120–127 BPM, toques jazz y deep/funky house.</li>
              <li><strong>⚡ Tecno experimental (2023–2024)</strong> — sonidos industriales, progressive y texturas atmosféricas.</li>
              <li><strong>🌍 Fusión actual (2024–2025)</strong> — afro house, nu-disco y melodic house en mezcla propia.</li>
            </ol>
          </article>

          <aside className="stats" aria-hidden={prefersReduce ? "true" : "false"}>
            <div className="stat"><div className="num" ref={c1}>0+</div><div className="label">sets subidos</div></div>
            <div className="stat"><div className="num" ref={c2}>0 meses</div><div className="label">nuevas mezclas</div></div>
            <div className="stat"><div className="num" ref={c3}>0 min</div><div className="label">por sesión</div></div>
            <div className="stat"><div className="num" ref={c4}>0+</div><div className="label">reproducciones</div></div>
          </aside>
        </div>

        <div className="more">
          <p>Equipo: Pioneer CDJ-3000 & Allen & Heath XONE:96. Me gusta experimentar (probé mezclas asistidas por IA) y tocar 2–3 veces al mes en Barcelona.</p>
          <p className="cta-row">
            <a href="https://soundcloud.com" className="btn" target="_blank" rel="noopener noreferrer">Escucha mis sets</a>
            <a className="ghost" href="#events">Próximos eventos</a>
          </p>
        </div>
      </div>

      <style jsx>{`
        /* This section *overlaps* the previous video viewport so the mosaic fills the same visual space */
        .about-wrap {
          position: relative;
          z-index: 5; /* above .video-copy (z-index:2) */
          margin-top: -100vh;  /* pull up to overlay viewport */
          padding-top: 100vh;  /* keep space for document flow */
          overflow: visible;
          color: white;
          background: linear-gradient(180deg, rgba(0,0,0,0.24), rgba(0,0,0,0.12));
        }

        .mosaic {
          position: fixed;
          left: 2%;
          right: 2%;
          top: 6%;
          height: 68%;
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 12px;
          padding: 18px;
          pointer-events: none;
          z-index: 6;
          opacity: 0;
          transform: translateY(18px) scale(1.02);
          transition: opacity 600ms ease, transform 700ms cubic-bezier(.16,.95,.24,1);
        }

        .about-wrap.is-revealed .mosaic {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .tile {
          height: 72px;
          border-radius: 10px;
          background: linear-gradient(135deg, rgba(255,255,255,0.10), rgba(255,255,255,0.03));
          box-shadow: 0 10px 26px rgba(0,0,0,0.45) inset;
          transform: translateY(var(--init-ty, 40px)) rotate(var(--init-rot, 6deg));
          opacity: 0.06;
          transition: transform 850ms cubic-bezier(.16,.95,.24,1), opacity 650ms ease;
        }
        .about-wrap.is-revealed .tile {
          transform: translate3d(0,0,0) rotate(0deg);
          opacity: 0.20;
          transition-delay: var(--delay, 0ms);
        }

        .content {
          position: relative;
          z-index: 8;
          max-width: 1100px;
          margin: 0 auto;
          padding: 48px 20px 100px 20px;
          backdrop-filter: blur(6px) saturate(110%);
        }

        .heading {
          font-size: 2.6rem;
          margin: 6px 0 18px 0;
          min-height: 1.4em;
          font-weight: 700;
          letter-spacing: 0.4px;
          color: #fff;
          opacity: 0;
          transform: translateY(14px);
          transition: all 700ms ease;
        }
        .about-wrap.is-revealed .heading { opacity: 1; transform: translateY(0); }

        .intro p { margin: 0 0 18px 0; line-height: 1.45; color: rgba(255,255,255,0.95); }

        .timeline { display: grid; grid-template-columns: 1fr 260px; gap: 22px; align-items: start; margin-top: 12px; }

        .stats { background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01)); border-radius: 10px; padding: 12px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; text-align: center; }
        .stat .num { font-weight: 800; font-size: 1.2rem; line-height: 1; }
        .stat .label { font-size: 0.85rem; opacity: 0.85; }

        .more { margin-top: 20px; color: rgba(255,255,255,0.95); }
        .btn { display: inline-block; padding: 10px 16px; border-radius: 999px; text-decoration: none; color: white; font-weight: 600; margin-right: 12px; transition: transform .18s ease, box-shadow .18s; border: 1px solid rgba(255,255,255,0.08); background: linear-gradient(90deg, rgba(255,100,150,0.12), rgba(120,80,255,0.14)); }
        .btn:hover { transform: translateY(-4px); box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .ghost { color: rgba(255,255,255,0.9); text-decoration: underline; opacity: 0.9; }

        @media (max-width: 880px) {
          .mosaic { grid-template-columns: repeat(4, 1fr); top: 8%; height: 52%; }
          .tile { height: 52px; }
          .timeline { grid-template-columns: 1fr; gap: 18px; }
          .content { padding-top: 48px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .mosaic, .tile, .heading, .btn { transition: none !important; transform: none !important; animation: none !important; }
        }
      `}</style>
    </section>
  );
}
