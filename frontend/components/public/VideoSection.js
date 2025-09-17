"use client";

/*
 * VideoSection optimizado:
 * - Carga GSAP/ScrollTrigger bajo demanda (requestIdleCallback/setTimeout)
 * - Respeta prefers-reduced-motion
 * - Limpieza completa de ScrollTriggers/timelines
 * - Video con preload="metadata" + poster para mejorar el primer paint
 */

import { useEffect, useRef, useState } from "react";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "700"] });

export default function VideoSection() {
  const videoRef = useRef(null);
  const triggerRef = useRef(null);
  const textContainerRef = useRef(null);
  const aboutSectionRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  // Función para alternar el audio
  const toggleAudio = () => {
    if (videoRef.current) {
      const newMutedState = !isMuted;
      videoRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
    }
  };

  // Función para scroll hacia la sección "sobre mi"
  const scrollToAbout = () => {
    // Buscar la sección completa "sobre-mi-section"
    const aboutSection = document.querySelector('.sobre-mi-section');
    if (aboutSection) {
      // Hacer scroll suave a la sección
      aboutSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start', // Comenzar desde el inicio de la sección
        inline: 'nearest'
      });
    }
  };

  useEffect(() => {
    let ctx; // gsap.context
    let mounted = true;
    let resizeHandler;

    // Respeta preferencias del usuario (reduce motion)
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Helper para planificar trabajo pesado tras el primer paint
    const scheduleIdle = (cb) => {
      if (typeof window !== "undefined" && "requestIdleCallback" in window) {
        window.requestIdleCallback(cb, { timeout: 1200 });
      } else {
        setTimeout(cb, 0);
      }
    };

    // Autoplay seguro del video (no romper si el navegador lo bloquea)
    if (videoRef.current) {
      const v = videoRef.current;
      v.muted = true;
      v.playsInline = true;
      v.play().catch(() => { });
    }

    if (!prefersReduced) {
      scheduleIdle(async () => {
        if (!mounted) return;

        // Import dinámico SOLO en cliente
        const gsapMod = await import("gsap");
        const stMod = await import("gsap/ScrollTrigger");
        const gsap = gsapMod.gsap || gsapMod.default || gsapMod;
        const ScrollTrigger = stMod.ScrollTrigger || stMod.default;
        gsap.registerPlugin(ScrollTrigger);

        if (!mounted) return;

        // Encapsular animaciones en el nodo raíz para revert limpio
        ctx = gsap.context(() => {
          if (!textContainerRef.current || !triggerRef.current) return;

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: triggerRef.current,
              scrub: true,
              start: "top top",
              end: "bottom top",
            },
          });

          // Usar función para leer viewport en tiempo de ejecución
          tl.to(textContainerRef.current, { y: () => -window.innerHeight }, 0);

          // Animación de entrada para la sección "Sobre mí"
          if (aboutSectionRef.current) {
            gsap.fromTo(
              aboutSectionRef.current,
              { opacity: 0, y: 100 },
              {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: aboutSectionRef.current,
                  start: "top 80%",
                  end: "bottom 20%",
                  toggleActions: "play none none reverse",
                  onEnter: () => {
                    const aboutContainer =
                      aboutSectionRef.current?.querySelector(".about-container");
                    if (aboutContainer) aboutContainer.classList.add("slide-in");
                  },
                },
              }
            );
          }

          // Recalcular medidas en resize (móviles/teclado virtual)
          resizeHandler = () => ScrollTrigger.refresh();
          window.addEventListener("resize", resizeHandler);
        }, triggerRef);
      });
    }

    return () => {
      mounted = false;
      if (resizeHandler) window.removeEventListener("resize", resizeHandler);
      ctx?.revert(); // limpia timelines + ScrollTriggers
    };
  }, []);

  return (
    <div id="video-component">
      {/* Sección del Video con Texto DJ JOSEPE */}
      <div ref={triggerRef} className="video-section">
        <video
          ref={videoRef}
          src="/video-dj.mp4"
          loop
          autoPlay
          muted
          playsInline
          preload="metadata"
        />
        <div ref={textContainerRef} className="video-copy">
          <h5 id="dj" className={montserrat.className} style={{ fontWeight: 400 }}>
            DJ
          </h5>
          <h5 id="josepe" className={montserrat.className} style={{ fontWeight: 700 }}>
            JOSEPE
          </h5>
        </div>
        
        {/* Flecha animada para scroll - fuera del mix-blend-mode */}
        <div className="arrow-container">
          <div className="arrow bounce" onClick={scrollToAbout}></div>
        </div>
        
        {/* Botón de control de audio */}
        <button 
          onClick={toggleAudio}
          className="audio-toggle-btn"
          aria-label={isMuted ? "Activar sonido" : "Silenciar"}
        >
          <i className={`fa-solid ${isMuted ? 'fa-volume-xmark' : 'fa-volume-high'}`} style={{ color: '#B2B9F1' }}></i>
        </button>
      </div>

      {/* —— SOBRE MÍ (compacto) —— */}
      <div className="sobre-mi-section" ref={aboutSectionRef} style={{
        opacity: 0,
        transform: 'translateY(100px)',
        transition: 'opacity 0.5s ease, transform 0.5s ease'
      }}>
        <div className="section bg-light text-dark about-container">
          <div className="container">
            {/* Título y descripción en el bloque blanco */}
            <div className="row mb-5" style={{ marginTop: '10%' }}>
              <div className="col-lg-10 mx-auto text-center">
                <h1 className="display-4 fw-bold mb-3">Sobre Mí</h1>
                <p className="lead text-muted mb-4">Identidad, estilo y directo</p>
                <p className="lead">
                  Soy <strong>Josepe</strong>, DJ en Barcelona. Combino enfoque <strong>estratégico + artístico</strong> y
                  crezco de forma <strong>orgánica</strong> en la escena.
                </p>
              </div>
            </div>

            {/* Grid de iconos */}
            <div className="row g-4 about-content" style={{ transform: 'scaleY(0.9)' }}>
              <div className="col-md-6 col-lg-4">
                <div className="p-4 h-100 rounded shadow-sm text-center bg-white">
                  <i className="fas fa-record-vinyl fa-2x text-warning mb-3"></i>
                  <h4 className="fw-bold mb-2">Estilo (3 etapas)</h4>
                  <ul className="list-unstyled mb-0 small text-start">
                    <li>🏠 House clásico (2022–23): deep/funky, 120–127 BPM</li>
                    <li>⚡ Tecno experimental (2023–24): tech/prog industrial</li>
                    <li>🌍 Fusión actual (2024–25): afro, nu-disco, melodic</li>
                  </ul>
                </div>
              </div>

              <div className="col-md-6 col-lg-4">
                <div className="p-4 h-100 rounded shadow-sm text-center bg-white">
                  <i className="fas fa-sliders-h fa-2x text-warning mb-3"></i>
                  <h4 className="fw-bold mb-2">Equipo & Método</h4>
                  <p className="mb-0 small">
                    <strong>CDJ-3000</strong> + <strong>XONE:96</strong>. Técnica cuidada y curiosidad tech
                    (incluye pruebas con <strong>IA</strong>).
                  </p>
                </div>
              </div>

              <div className="col-md-6 col-lg-4">
                <div className="p-4 h-100 rounded shadow-sm text-center bg-white">
                  <i className="fas fa-headphones fa-2x text-warning mb-3"></i>
                  <h4 className="fw-bold mb-2">Plataformas</h4>
                  <p className="mb-0 small">
                    <strong>50+</strong> sets en SoundCloud, nuevas mezclas cada ~<strong>2 meses</strong>,
                    <strong> 15k+</strong> reproducciones.
                  </p>
                </div>
              </div>

              <div className="col-md-6 col-lg-4">
                <div className="p-4 h-100 rounded shadow-sm text-center bg-white event-card">
                  <div className="event-icon-container mb-3">
                    <i className="fas fa-bolt fa-2x text-warning"></i>
                    <div className="pulse-ring"></div>
                  </div>
                  <h4 className="fw-bold mb-3">Directo & Eventos</h4>
                  <div className="event-stats mb-3">
                    <span className="badge bg-warning text-dark me-2">2-3 shows/mes</span>
                    <span className="badge bg-outline-warning">BCN</span>
                  </div>
                  <div className="event-highlights">
                    <div className="event-item">
                      <i className="fas fa-music text-warning me-2"></i>
                      <strong>Latin Underground</strong>
                    </div>
                    <div className="event-item">
                      <i className="fas fa-users text-warning me-2"></i>
                      <span>B2B con colectivos locales</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg-4">
                <div className="p-4 h-100 rounded shadow-sm text-center bg-white">
                  <i className="fas fa-star fa-2x text-warning mb-3"></i>
                  <h4 className="fw-bold mb-2">Referentes</h4>
                  <p className="mb-0 small">
                    <strong>Honey Dijon</strong>, <strong>Black Coffee</strong>, <strong>Louie Vega</strong>, <strong>Bedouin</strong>.
                  </p>
                </div>
              </div>

              <div className="col-md-6 col-lg-4">
                <div className="p-4 h-100 rounded shadow-sm text-center bg-white">
                  <i className="fas fa-chart-line fa-2x text-warning mb-3"></i>
                  <h4 className="fw-bold mb-2">Estrategia</h4>
                  <p className="mb-0 small">
                    Instagram + SoundCloud para el lado artístico; LinkedIn para lo profesional.
                    Foco en <strong>experiencia en vivo</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center mt-5">
              <a href="/contact" className="btn btn-warning btn-lg me-3">
                <i className="fas fa-envelope me-2"></i> Contacto
              </a>
              <a href="/sets" className="btn btn-outline-dark btn-lg">
                <i className="fas fa-music me-2"></i> Escuchar Sets
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* —— SECCIÓN SETS —— */}
      <div className="sets-section">
        <div className="container">
          <div className="row mb-5">
            <div className="col-lg-8 mx-auto text-center">
              <h2 className="display-5 fw-bold mb-3">Sets Destacados</h2>
              <p className="lead text-muted">Explora mis últimas sesiones y mezclas</p>
            </div>
          </div>
          
          <div className="row g-4">
            {/* Track 1 */}
            <div className="col-lg-6">
              <div className="track-card">
                <div className="track-cover">
                  <a href="https://soundcloud.com/jose-miguel-serra/jam-session-house-4-35-min" target="_blank" rel="noopener noreferrer">
                    <img src="https://i1.sndcdn.com/artworks-000203731318-3gn8o9-t500x500.jpg" alt="Jam Session House #4 Cover" />
                    <div className="play-overlay">
                      <i className="fas fa-play"></i>
                    </div>
                  </a>
                </div>
                <div className="track-content">
                  <h4 className="track-title">#4 Jam Session House 35 min</h4>
                  <div className="track-player">
                    <iframe 
                      width="100%" 
                      height="166" 
                      scrolling="no" 
                      frameBorder="no" 
                      allow="autoplay"
                      src="https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/jose-miguel-serra/jam-session-house-4-35-min&color=%23ffc107&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true">
                    </iframe>
                  </div>
                </div>
              </div>
            </div>

            {/* Track 2 */}
            <div className="col-lg-6">
              <div className="track-card">
                <div className="track-cover">
                  <a href="https://soundcloud.com/jose-miguel-serra/43-jam-session-dance" target="_blank" rel="noopener noreferrer">
                    <img src="https://i1.sndcdn.com/artworks-y5dYpLKEpGIl-0-t500x500.jpg" alt="Jam Session DANCE #43 Cover" />
                    <div className="play-overlay">
                      <i className="fas fa-play"></i>
                    </div>
                  </a>
                </div>
                <div className="track-content">
                  <h4 className="track-title">#43 Jam Session DANCE</h4>
                  <div className="track-player">
                    <iframe 
                      width="100%" 
                      height="166" 
                      scrolling="no" 
                      frameBorder="no" 
                      allow="autoplay"
                      src="https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/jose-miguel-serra/43-jam-session-dance&color=%23ffc107&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true">
                    </iframe>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA para más sets */}
          <div className="text-center mt-5">
            <a href="/sets" className="btn btn-warning btn-lg">
              <i className="fas fa-headphones me-2"></i> Ver Todos los Sets
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* —— Sección video —— */
        #video-component .video-section {
          overflow: hidden;
          position: relative;
          width: 100%;
          height: 200vh;
        }

        #video-component .video-section video {
          width: 100%;
          height: 100vh;
          object-fit: cover;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 1;
          pointer-events: none;
          transform: scale(0.93);
          transform-origin: center;
          filter: brightness(1.3) contrast(1.1);
        }

        #video-component .video-copy {
          height: 100vh;
          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          margin-left: -8vw;
          line-height: 1.0;
          background-color: rgb(8, 8, 8);
          user-select: none;
          mix-blend-mode: multiply;
          display: flex;
          flex-direction: column;
          justify-content: center;
          z-index: 5;
        }

        #video-component h5 {
          color: #ffffff;
          letter-spacing: 1vw;
          margin: 0;
          transform-origin: center;
        }

        #video-component #dj {
          color: #ffffff;
          font-weight: 400;
          letter-spacing: 0.5vw;
          margin: 0;
          padding-left: 60vw;
          transform: scaleY(1.1);
          transform-origin: center;
          font-size: 13vw;
        }

        #video-component #josepe {
          color: #ffffff;
          font-weight: 700;
          letter-spacing: 0.5vw;
          margin: 0;
          padding-left: 15vw;
          padding-bottom: 5vh;
          transform: scaleX(1.2) scaleY(1.7);
          transform-origin: center;
          font-size: 20vw;
        }

        /* Botón de control de audio */
        .audio-toggle-btn {
          position: fixed;
          bottom : 5rem;
          right: 1.5rem;
          z-index: 9999;
          background: transparent;
          border: none;
          width: 3rem;
          height: 3rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #DADDED;
          font-size: 1.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .audio-toggle-btn:hover {
          transform: scale(1.2);
          color: #ffc107;
        }

        .audio-toggle-btn:active {
          transform: scale(0.95);
        }

        /* Flecha animada para scroll */
        .arrow {
          position: fixed;
          bottom: 10vh;
          left: 50%;
          margin-left: -1.25rem;
          width: 2.5rem;
          height: 2.5rem;
          z-index: 9999;
          background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNi4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iNTEycHgiIGhlaWdodD0iNTEycHgiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA1MTIgNTEyIiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxwYXRoIGZpbGw9IiNGRkZGRkYiIGQ9Ik0yOTMuNzUxLDQ1NS44NjhjLTIwLjE4MSwyMC4xNzktNTMuMTY1LDE5LjkxMy03My42NzMtMC41OTVsMCwwYy0yMC41MDgtMjAuNTA4LTIwLjc3My01My40OTMtMC41OTQtNzMuNjcyICBsMTg5Ljk5OS0xOTBjMjAuMTc4LTIwLjE3OCw1My4xNjQtMTkuOTEzLDczLjY3MiwwLjU5NWwwLDBjMjAuNTA4LDIwLjUwOSwyMC43NzIsNTMuNDkyLDAuNTk1LDczLjY3MUwyOTMuNzUxLDQ1NS44Njh6Ii8+DQo8cGF0aCBmaWxsPSIjRkZGRkZGIiBkPSJNMjIwLjI0OSw0NTUuODY4YzIwLjE4LDIwLjE3OSw1My4xNjQsMTkuOTEzLDczLjY3Mi0wLjU5NWwwLDBjMjAuNTA5LTIwLjUwOCwyMC43NzQtNTMuNDkzLDAuNTk2LTczLjY3MiAgbC0xOTAtMTkwYy0yMC4xNzgtMjAuMTc4LTUzLjE2NC0xOS45MTMtNzMuNjcxLDAuNTk1bDAsMGMtMjAuNTA4LDIwLjUwOS0yMC43NzIsNTMuNDkyLTAuNTk1LDczLjY3MUwyMjAuMjQ5LDQ1NS44Njh6Ii8+DQo8L3N2Zz4=");
          background-size: contain;
          background-repeat: no-repeat;
          opacity: 1;
          filter: brightness(0) invert(1);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .arrow:hover {
          transform: scale(1.1);
          opacity: 0.8;
        }

        .bounce {
          animation: bounce 2s infinite;
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-1.8rem);
          }
          60% {
            transform: translateY(-0.9rem);
          }
        }

        @media (max-width: 768px) {
          #video-component #dj {
            padding-left: 50vw;
            letter-spacing: 2vw;
            font-size: 20vw;
          }
          #video-component #josepe {
            padding-left: 10vw;
            letter-spacing: 2vw;
            font-size: 45vw;
          }
          
          .audio-toggle-btn {
            top: 1rem;
            right: 1rem;
            width: 2.5rem;
            height: 2.5rem;
            font-size: 1.2rem;
          }
          
          .arrow {
            width: 2rem;
            height: 2rem;
            margin-left: -1rem;
            bottom: 3vh;
          }
        }

        @media (max-width: 480px) {
          #video-component #dj {
            padding-left: 30vw;
            font-size: 18vw;
          }
          #video-component #josepe {
            padding-left: 5vw;
            font-size: 40vw;
          }
          
          .audio-toggle-btn {
            top: 0.75rem;
            right: 0.75rem;
            width: 2.2rem;
            height: 2.2rem;
            font-size: 1rem;
          }
          
          .arrow {
            width: 1.5rem;
            height: 1.5rem;
            margin-left: -0.75rem;
            bottom: 2vh;
          }
        }

        /* —— Sección sobre mí —— */
        #video-component .sobre-mi-section {
          position: relative;
          z-index: 10;
          background: #ffffff;
          min-height: 100vh;
          width: 100%;
          color: #000000;
        }

        #video-component .sobre-mi-section * {
          color: inherit;
        }

        .about-container.slide-in {
          animation: slideInFromLeft 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        .about-content > * {
          opacity: 1;
          transform: translateX(0);
          transition: all 0.6s ease;
        }

        .about-container.slide-in .about-content > *:nth-child(1) { animation: slideInContent 0.6s ease 0.2s forwards; }
        .about-container.slide-in .about-content > *:nth-child(2) { animation: slideInContent 0.6s ease 0.3s forwards; }
        .about-container.slide-in .about-content > *:nth-child(3) { animation: slideInContent 0.6s ease 0.4s forwards; }
        .about-container.slide-in .about-content > *:nth-child(4) { animation: slideInContent 0.6s ease 0.5s forwards; }
        .about-container.slide-in .about-content > *:nth-child(5) { animation: slideInContent 0.6s ease 0.6s forwards; }
        .about-container.slide-in .about-content > *:nth-child(6) { animation: slideInContent 0.6s ease 0.7s forwards; }
        .about-container.slide-in .about-content > *:nth-child(7) { animation: slideInContent 0.6s ease 0.8s forwards; }
        .about-container.slide-in .about-content > *:nth-child(8) { animation: slideInContent 0.6s ease 0.9s forwards; }

        @keyframes slideInFromLeft {
          from { opacity: 0; transform: translateX(-100%); }
          to   { opacity: 1; transform: translateX(0); }
        }

        @keyframes slideInContent {
          from { opacity: 0; transform: translateX(-30px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        .stage-card {
          background: rgba(255, 255, 255, 0.95);
          border: 2px solid rgba(255, 193, 7, 0.2);
          transition: all 0.3s ease;
        }
        .stage-card:hover {
          transform: translateY(-5px);
          border-color: #ffc107;
          box-shadow: 0 10px 25px rgba(255, 193, 7, 0.2);
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.95);
          border: 2px solid rgba(255, 193, 7, 0.3);
          transition: all 0.3s ease;
        }
        .stat-card:hover {
          transform: translateY(-5px);
          border-color: #ffc107;
          box-shadow: 0 10px 25px rgba(255, 193, 7, 0.2);
        }

        .platform-stats .stat-card {
          background: rgba(255, 193, 7, 0.1);
          border: 1px solid rgba(255, 193, 7, 0.3);
        }
        .platform-stats .stat-card:hover {
          background: rgba(255, 193, 7, 0.2);
          transform: translateY(-3px);
        }

        .specialty-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 193, 7, 0.2);
          transition: all 0.3s ease;
        }
        .specialty-card:hover {
          background: rgba(255, 193, 7, 0.1);
          border-color: #ffc107;
          transform: translateY(-5px);
        }

        .about-content h3 {
          border-bottom: 2px solid rgba(255, 193, 7, 0.3);
          padding-bottom: 0.5rem;
          margin-bottom: 2rem;
        }
        .about-content ul li {
          padding: 0.5rem 0;
          border-left: 3px solid #ffc107;
          padding-left: 1rem;
          margin-bottom: 0.5rem;
          background: rgba(255, 193, 7, 0.05);
        }
        .about-content strong { color: #ffc107; font-weight: 600; }

        /* Estilos especiales para la tarjeta de eventos */
        .event-card {
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        .event-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 15px 40px rgba(255, 193, 7, 0.3);
          border-color: #ffc107;
        }
        
        .event-icon-container {
          position: relative;
          display: inline-block;
        }
        
        .pulse-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 60px;
          height: 60px;
          border: 3px solid #ffc107;
          border-radius: 50%;
          opacity: 0;
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
          }
        }
        
        .event-stats .badge {
          font-size: 0.75rem;
          padding: 0.4rem 0.8rem;
        }
        
        .bg-outline-warning {
          background: transparent;
          border: 1px solid #ffc107;
          color: #ffc107;
        }
        
        .event-highlights {
          text-align: left;
        }
        
        .event-item {
          display: flex;
          align-items: center;
          margin-bottom: 0.5rem;
          padding: 0.3rem 0;
          font-size: 0.9rem;
        }
        
        .event-card:hover .pulse-ring {
          animation-duration: 1s;
        }

        .btn-warning { background-color: #ffc107; border-color: #ffc107; color: #000; }
        .btn-warning:hover { background-color: #e0a800; border-color: #d39e00; color: #000; }
        .btn-outline-dark { border-color: #343a40; color: #343a40; }
        .btn-outline-dark:hover { background-color: #343a40; border-color: #343a40; color: #fff; }

        .text-warning { color: #ffc107 !important; }
        .display-6 { font-size: 2.5rem; font-weight: 300; line-height: 1.2; }
        .section { padding: 80px 0; }

        @media (max-width: 768px) {
          .about-content h2 { font-size: 2rem; }
          .about-content h3 { font-size: 1.5rem; }
          .stage-card { padding: 1rem; }
          .platform-stats .col-md-6 { margin-bottom: 1rem; }
          .display-6 { font-size: 2rem; }
          .specialty-card { margin-bottom: 30px; }
          .track-card { margin-bottom: 2rem; }
          .track-cover img { height: 200px; }
        }

        /* Estilos para la sección de sets */
        .sets-section {
          padding: 80px 0;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        }

        .track-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
          height: 100%;
        }

        .track-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.15);
        }

        .track-cover {
          position: relative;
          overflow: hidden;
        }

        .track-cover img {
          width: 100%;
          height: 250px;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .track-cover:hover img {
          transform: scale(1.05);
        }

        .play-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .track-cover:hover .play-overlay {
          opacity: 1;
        }

        .play-overlay i {
          color: #ffc107;
          font-size: 3rem;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .track-content {
          padding: 1.5rem;
        }

        .track-title {
          margin: 0 0 1rem 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: #333;
        }

        .track-player iframe {
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
}
