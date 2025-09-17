"use client";

import { useEffect } from 'react';
import Link from 'next/link';

export default function SobreMi() {
  useEffect(() => {
    // Animación de entrada desde la izquierda
    const aboutSection = document.querySelector('.about-container');
    if (aboutSection) {
      // Inicialmente oculto desde la izquierda
      aboutSection.style.transform = 'translateX(-100%)';
      aboutSection.style.opacity = '0';

      // Animar la entrada después de un breve delay
      setTimeout(() => {
        aboutSection.style.transform = 'translateX(0)';
        aboutSection.style.opacity = '1';
        aboutSection.classList.add('slide-in');
      }, 100);
    }
  }, []);

  return (
    <div className="about-page">
      {/* Hero Section específica para About */}
      <section
        className="about-hero d-flex align-items-center justify-content-center text-center py-5"
        style={{
          minHeight: '40vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#fff',
          position: 'relative',
          paddingTop: '6rem',
        }}
      >
        <div className="container">
          <h1 className="display-3 fw-bold">Sobre Mí</h1>
          <p className="lead">
            Conoce la historia detrás de la música
          </p>
        </div>
      </section>

      {/* Contenido principal */}
      <section
        className="about-container section bg-light text-dark"
        style={{
          transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          overflow: 'hidden'
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="about-content">

                {/* Introducción personal */}
                <div className="mb-5">
                  <h2 className="mb-4 text-warning display-5 fw-bold">Hola, soy José Miguel Serra</h2>
                  <p className="lead mb-4">
                    Aunque en la escena electrónica de Barcelona muchos me conocen simplemente como Josepe.
                    Combino una trayectoria profesional sólida con una carrera musical emergente en el mundo de la música electrónica.
                  </p>
                  <p className="mb-4">
                    Me gusta pensar que llevo un enfoque tanto estratégico como artístico a los platos: por un lado aplico mi experiencia técnica y de marketing,
                    y por otro me dejo llevar por la sensibilidad musical del momento. En mis redes me describo a veces como "Sometimes DJ" (DJ ocasional),
                    y no es por casualidad: decidí crecer poco a poco en la escena, con una estrategia deliberada que me permite evolucionar con autenticidad
                    y credibilidad en el circuito musical barcelonés.
                  </p>
                </div>

                {/* Mi estilo musical */}
                <div className="mb-5">
                  <h3 className="text-warning mb-4 display-6 fw-bold">Mi estilo musical</h3>
                  <p className="mb-4">
                    Mi estilo musical está en constante evolución, y me gusta pensar en mi trayectoria como DJ en tres grandes capítulos que reflejan esa progresión:
                  </p>

                  <div className="musical-stages">
                    <div className="stage-card p-4 mb-4 rounded shadow-sm">
                      <h4 className="text-warning mb-3">🏠 House clásico (2022–2023)</h4>
                      <p>
                        Mis inicios estuvieron marcados por ritmos house de 120 a 127 BPM con influencias deep y funky house.
                        Por aquel entonces disfrutaba mezclando toques de jazz con grooves minimalistas. Un ejemplo de esa etapa es mi sesión
                        "Tutti Frutti Opening House", donde logré combinar melodías jazzísticas con ritmos house de vieja escuela.
                      </p>
                    </div>

                    <div className="stage-card p-4 mb-4 rounded shadow-sm">
                      <h4 className="text-warning mb-3">⚡ Tecno experimental (2023–2024)</h4>
                      <p>
                        A medida que fui ganando confianza, me adentré en terrenos más tech house y progressive house, experimentando con sonidos más industriales y atmosféricos.
                        En esta fase probé cosas nuevas y un poco más oscuras; por ejemplo, en "Brutal Session TECH HOUSE 126 BPM A+" exploré un sonido techno de tintes industriales
                        que amplió mis propios límites y me enseñó mucho a nivel técnico.
                      </p>
                    </div>

                    <div className="stage-card p-4 mb-4 rounded shadow-sm">
                      <h4 className="text-warning mb-3">🌍 Fusión actual (2024–2025)</h4>
                      <p>
                        En la etapa más reciente estoy mezclando todo lo aprendido para crear una fusión personal. Ahora incorporo ritmos de afro house,
                        vibraciones de nu-disco y la emotividad del melodic house en mis sets. Una muestra de esta evolución es "AFRO House Session – 2025",
                        una mezcla cargada de sonidos orgánicos y percusiones tribales que reflejan mi búsqueda actual de texturas cálidas y ritmos globales.
                      </p>
                    </div>
                  </div>

                  <p className="mt-4">
                    A lo largo de estas etapas, mantengo un enfoque artístico pero metódico: cada sesión cuenta una historia.
                    Si escuchas mis sets en orden, notarás una evolución técnica, conceptual y emocional que narra mi crecimiento como DJ.
                  </p>
                </div>

                {/* Presencia en plataformas */}
                <div className="mb-5">
                  <h3 className="text-warning mb-4 display-6 fw-bold">Presencia en plataformas</h3>
                  <p className="mb-4">
                    La verdad es que me encanta compartir mis sets en SoundCloud, que es donde publico la mayor parte de mi música.
                    Allí podrás encontrar más de cincuenta sesiones mías, con novedades periódicas.
                  </p>

                  <div className="platform-stats row">
                    <div className="col-md-6 mb-3">
                      <div className="stat-card p-3 rounded shadow-sm text-center">
                        <h4 className="text-warning fw-bold">50+</h4>
                        <p className="mb-0">sets subidos</p>
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <div className="stat-card p-3 rounded shadow-sm text-center">
                        <h4 className="text-warning fw-bold">2 meses</h4>
                        <p className="mb-0">nuevas mezclas</p>
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <div className="stat-card p-3 rounded shadow-sm text-center">
                        <h4 className="text-warning fw-bold">1h 20m</h4>
                        <p className="mb-0">por sesión</p>
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <div className="stat-card p-3 rounded shadow-sm text-center">
                        <h4 className="text-warning fw-bold">15.000+</h4>
                        <p className="mb-0">reproducciones</p>
                      </div>
                    </div>
                  </div>

                  <p className="mt-4">
                    Equipo pro y experimentos tech: Soy un geek del sonido y cuido mucho la técnica. Pincho con unos Pioneer CDJ-3000 y una mesa Allen & Heath XONE:96,
                    lo que me da una calidad de sonido espectacular y un control muy fino. Además, me gusta innovar: incluso llegué a probar una mezcla asistida por inteligencia artificial
                    (mi "TWINSICK Session (beta)") para explorar nuevas fronteras creativas.
                  </p>
                </div>

                {/* Eventos y colaboraciones */}
                <div className="mb-5">
                  <h3 className="text-warning mb-4 display-6 fw-bold">Eventos y colaboraciones</h3>
                  <p className="mb-4">
                    Una de las cosas que más disfruto es llevar mi música al directo. En abril de 2025 tuve la oportunidad de participar en un evento multicultural
                    llamado "Latin Underground" en Diobar, donde compartí cabina con colectivos latinos. Fue una noche mágica en la que pude ser versátil y fusionar
                    ritmos latinos con beats electrónicos; esas experiencias me recuerdan por qué amo ser DJ.
                  </p>
                  <p className="mb-4">
                    Actualmente suelo presentarme 2-3 veces al mes en distintos locales de Barcelona, siempre con la idea de crecer de forma constante y enfocada en nichos
                    donde mi estilo encaja bien. En el camino he tenido la suerte de colaborar con colegas y colectivos geniales: desde intercambiar trucos técnicos con la gente de
                    <strong>@djtechbcn</strong>, hasta armar sesiones B2B junto a amigos de <strong>@barcelonahousemusic</strong>, o ser DJ residente por temporadas en el
                    <strong>Nēsh Hotel Barcelona (@nesihotelbarcelona)</strong>. Cada colaboración y cada evento en vivo me ha enseñado algo nuevo y ha aportado a mi evolución como artista.
                  </p>
                </div>

                {/* Inspiración */}
                <div className="mb-5">
                  <h3 className="text-warning mb-4 display-6 fw-bold">Inspiración</h3>
                  <p className="mb-4">
                    Si hay algo que guía mi camino, es la inspiración que tomo de otros artistas. En el panorama internacional admiro a varios referentes:
                  </p>
                  <ul className="list-unstyled">
                    <li className="mb-2"><strong>Honey Dijon</strong> - por cómo fusiona el house clásico con el moderno y la energía que desprende en cada set</li>
                    <li className="mb-2"><strong>Black Coffee</strong> - por sus profundos beats de afro house cargados de percusiones tribales que te atrapan</li>
                    <li className="mb-2"><strong>Louie Vega</strong> - quien me enseña a integrar raíces latinas y jazz en la música electrónica</li>
                    <li className="mb-2"><strong>Bedouin</strong> - que me impulsa a incluir sonidos étnicos y atmosféricos dentro del melodic house</li>
                  </ul>
                  <p className="mt-4">
                    En la escena local barcelonesa también tengo mis afinidades. Siento una conexión especial con DJs como Pau Roca y Clip!,
                    con quienes comparto esa sensibilidad por la selección musical cuidada y la pasión por sorprender al público a través de la mezcla.
                  </p>
                </div>

                {/* Estrategia digital */}
                <div className="mb-5">
                  <h3 className="text-warning mb-4 display-6 fw-bold">Estrategia digital</h3>
                  <p className="mb-4">
                    Mi otra faceta profesional (sí, esa de oficina y corbata) me ha servido para impulsar mi carrera musical de forma inteligente.
                    Gracias a mis conocimientos en marketing digital, he sabido gestionar mi presencia en redes y plataformas para conectar con el público adecuado.
                  </p>
                  <p className="mb-4">
                    Actualmente cuento con una comunidad de unos 1.234 seguidores en SoundCloud, y mis sets acumulan más de 45.000 reproducciones en total
                    (¡gracias de corazón por cada play!). Uso mucho Instagram, especialmente las Stories, para compartir el detrás de cámaras: desde cómo preparo un nuevo set
                    hasta anécdotas divertidas durante una noche de fiesta.
                  </p>
                  <p className="mb-4">
                    Eso sí, mantengo separadas mis dos facetas: mi vida profesional diaria vive en LinkedIn, mientras que mi lado artístico tiene casa en Instagram y SoundCloud.
                    Por ahora no me encontrarás en Spotify ni Apple Music, y es algo deliberado: prefiero centrarme en la experiencia en vivo y en la conexión directa con quienes me escuchan.
                    Mis sesiones están pensadas para disfrutarse de corrido, casi como un viaje sonoro que no quisiera ver interrumpido por el botón de skip.
                  </p>
                </div>

                {/* Bienvenido a mi mundo */}
                <div className="mb-5">
                  <h3 className="text-warning mb-4 display-6 fw-bold">Bienvenido a mi mundo</h3>
                  <p className="mb-4">
                    He creado esta página web con el objetivo de compartir contigo todo este recorrido musical. Aquí podrás seguir mi trayectoria, escuchar mis sets más recientes
                    a través de un reproductor integrado de SoundCloud, y enterarte de mis próximos eventos en el calendario de actuaciones (¡me encantaría verte en alguna de mis sesiones en vivo!).
                    También encontrarás una galería de fotos que capturan momentos especiales en cabina, y más detalles sobre mi estilo, influencias y hasta los servicios que ofrezco como DJ para eventos.
                  </p>
                  <p className="mb-4">
                    En resumen, soy Josepe y estoy encantado de recibirte en mi mundo musical. Mi meta es hacerte bailar, emocionarte y transportarte con cada mezcla.
                    ¡Gracias por pasarte por aquí y nos vemos en la pista!
                  </p>
                </div>

                <div className="text-center mt-5">
                  <Link href="/contact" className="btn btn-warning btn-lg me-3">
                    <i className="fas fa-envelope me-2"></i>
                    Contáctame
                  </Link>
                  <Link href="/sets" className="btn btn-outline-dark btn-lg">
                    <i className="fas fa-music me-2"></i>
                    Escucha mis Sets
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de especialidades */}
      <section className="specialties-section section bg-dark text-light">
        <div className="container">
          <h2 className="text-center mb-5 text-warning display-6 fw-bold">Mi Especialidad</h2>
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="specialty-card text-center p-4 rounded">
                <i className="fas fa-music fa-3x text-warning mb-3"></i>
                <h4>House Music</h4>
                <p>Ritmos profundos y envolventes que hacen vibrar la pista de baile.</p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="specialty-card text-center p-4 rounded">
                <i className="fas fa-bolt fa-3x text-warning mb-3"></i>
                <h4>Techno</h4>
                <p>Energía pura y beats contundentes para las noches más intensas.</p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="specialty-card text-center p-4 rounded">
                <i className="fas fa-headphones fa-3x text-warning mb-3"></i>
                <h4>EDM</h4>
                <p>Electronic Dance Music que conecta con todas las generaciones.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Estilos específicos para el componente SobreMi */}
      <style jsx>{`
        .about-container.slide-in {
          animation: slideInFromLeft 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        .about-content > * {
          opacity: 0;
          transform: translateX(-30px);
          transition: all 0.6s ease;
        }

        .about-container.slide-in .about-content > *:nth-child(1) {
          animation: slideInContent 0.6s ease 0.2s forwards;
        }

        .about-container.slide-in .about-content > *:nth-child(2) {
          animation: slideInContent 0.6s ease 0.3s forwards;
        }

        .about-container.slide-in .about-content > *:nth-child(3) {
          animation: slideInContent 0.6s ease 0.4s forwards;
        }

        .about-container.slide-in .about-content > *:nth-child(4) {
          animation: slideInContent 0.6s ease 0.5s forwards;
        }

        .about-container.slide-in .about-content > *:nth-child(5) {
          animation: slideInContent 0.6s ease 0.6s forwards;
        }

        .about-container.slide-in .about-content > *:nth-child(6) {
          animation: slideInContent 0.6s ease 0.7s forwards;
        }

        .about-container.slide-in .about-content > *:nth-child(7) {
          animation: slideInContent 0.6s ease 0.8s forwards;
        }

        .about-container.slide-in .about-content > *:nth-child(8) {
          animation: slideInContent 0.6s ease 0.9s forwards;
        }

        .stage-card {
          background: rgba(255, 255, 255, 0.95);
          border: 2px solid rgba(255, 193, 7, 0.2);
          transition: all 0.3s ease;
        }

        .stage-card:hover {
          transform: translateY(-5px);
          border-color: var(--primary-color);
          box-shadow: 0 10px 25px rgba(255, 193, 7, 0.2);
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.95);
          border: 2px solid rgba(255, 193, 7, 0.3);
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-5px);
          border-color: var(--primary-color);
          box-shadow: 0 10px 25px rgba(255, 193, 7, 0.2);
        }

        .platform-stats .stat-card {
          background: rgba(255, 193, 7, 0.1);
          border: 1px solid rgba(255, 193, 7, 0.3);
        }

        .platform-stats .stat-card:hover {
          background: rgba(255, 193, 7, 0.2);
          transform: translateY(-5px);
        }

        .specialty-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 193, 7, 0.2);
          transition: all 0.3s ease;
        }

        .specialty-card:hover {
          background: rgba(255, 193, 7, 0.1);
          border-color: var(--primary-color);
          transform: translateY(-5px);
        }

        @keyframes slideInFromLeft {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideInContent {
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .about-hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background:
            radial-gradient(circle at 20% 80%, rgba(255, 193, 7, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 193, 7, 0.05) 0%, transparent 50%);
          pointer-events: none;
        }

        /* Mejoras tipográficas para el nuevo contenido */
        .about-content h3 {
          border-bottom: 2px solid rgba(255, 193, 7, 0.3);
          padding-bottom: 0.5rem;
          margin-bottom: 2rem;
        }

        .about-content ul li {
          padding: 0.5rem 0;
          border-left: 3px solid var(--primary-color);
          padding-left: 1rem;
          margin-bottom: 0.5rem;
          background: rgba(255, 193, 7, 0.05);
        }

        .about-content strong {
          color: var(--primary-color);
          font-weight: 600;
        }

        /* Responsive para móviles */
        @media (max-width: 768px) {
          .about-content h2 {
            font-size: 2rem;
          }

          .about-content h3 {
            font-size: 1.5rem;
          }

          .stage-card {
            padding: 1rem;
          }

          .platform-stats .col-md-6 {
            margin-bottom: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
