'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Footer mejorado con información de ubicación, contacto y auto-ocultación
 */
export default function Footer() {
  const year = new Date().getFullYear();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const windowHeight = window.innerHeight;
      const mouseY = e.clientY;

      // Show footer when mouse is in bottom 80px of screen
      if (mouseY >= windowHeight - 80) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      // Show footer when reaching bottom of page (within 100px)
      if (scrollTop + windowHeight >= documentHeight - 100) {
        setIsVisible(true);
      } else {
        // Only hide if mouse is not in footer area
        const mouseEvent = new MouseEvent('mousemove', {
          clientY: 0 // Simulate mouse at top to trigger hide check
        });
        // Don't hide immediately, let mouse position take precedence
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <motion.footer
      className="py-5 bg-dark text-light fixed-bottom"
      initial={{ y: 100, opacity: 0 }}
      animate={{
        y: isVisible ? 0 : 100,
        opacity: isVisible ? 1 : 0
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      style={{
        background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(45, 45, 45, 0.95) 100%)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(255, 193, 7, 0.3)',
        zIndex: 1000
      }}
    >
      <div className="container">
        <div className="row">
          {/* Información de contacto */}
          <div className="col-md-4 mb-4">
            <h5 className="text-warning mb-3">
              <i className="fas fa-phone me-2"></i>
              Contacto
            </h5>
            <div className="mb-2">
              <i className="fas fa-envelope me-2 text-warning"></i>
              <a href="mailto:info@djjosepe.com" className="text-light text-decoration-none">
                info@djjosepe.com
              </a>
            </div>
            <div className="mb-2">
              <i className="fas fa-phone me-2 text-warning"></i>
              <a href="tel:+34123456789" className="text-light text-decoration-none">
                +34 123 456 789
              </a>
            </div>
            <div className="mb-2">
              <i className="fab fa-whatsapp me-2 text-warning"></i>
              <a href="https://wa.me/34123456789" className="text-light text-decoration-none" target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </div>
          </div>

          {/* Información de ubicación */}
          <div className="col-md-4 mb-4">
            <h5 className="text-warning mb-3">
              <i className="fas fa-map-marker-alt me-2"></i>
              Dónde Estamos
            </h5>
            <div className="mb-2">
              <i className="fas fa-city me-2 text-warning"></i>
              <span>Madrid, España</span>
            </div>
            <div className="mb-2">
              <i className="fas fa-globe me-2 text-warning"></i>
              <span>Eventos en toda España</span>
            </div>
            <div className="mb-2">
              <i className="fas fa-clock me-2 text-warning"></i>
              <span>Disponible 24/7</span>
            </div>
          </div>

          {/* Redes sociales y enlaces */}
          <div className="col-md-4 mb-4">
            <h5 className="text-warning mb-3">
              <i className="fas fa-share-alt me-2"></i>
              Síguenos
            </h5>
            <div className="mb-3">
              <a
                href="https://www.facebook.com/"
                className="me-3 text-warning fs-4"
                aria-label="Facebook"
                style={{ transition: 'all 0.3s ease' }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.color = '#4267B2';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.color = '#ffc107';
                }}
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                href="https://www.instagram.com/"
                className="me-3 text-warning fs-4"
                aria-label="Instagram"
                style={{ transition: 'all 0.3s ease' }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.color = '#E4405F';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.color = '#ffc107';
                }}
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a
                href="https://twitter.com/"
                className="me-3 text-warning fs-4"
                aria-label="Twitter"
                style={{ transition: 'all 0.3s ease' }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.color = '#1DA1F2';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.color = '#ffc107';
                }}
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a
                href="https://www.youtube.com/"
                className="me-3 text-warning fs-4"
                aria-label="YouTube"
                style={{ transition: 'all 0.3s ease' }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.color = '#FF0000';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.color = '#ffc107';
                }}
              >
                <i className="fab fa-youtube"></i>
              </a>
              <a
                href="https://soundcloud.com/"
                className="text-warning fs-4"
                aria-label="SoundCloud"
                style={{ transition: 'all 0.3s ease' }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.color = '#FF5500';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.color = '#ffc107';
                }}
              >
                <i className="fab fa-soundcloud"></i>
              </a>
            </div>
            <div className="mb-2">
              <a href="/gallery" className="text-light text-decoration-none">
                <i className="fas fa-images me-2 text-warning"></i>
                Galería de Fotos
              </a>
            </div>
            <div className="mb-2">
              <a href="/contact" className="text-light text-decoration-none">
                <i className="fas fa-calendar-alt me-2 text-warning"></i>
                Reservar Evento
              </a>
            </div>
          </div>
        </div>

        {/* Línea divisoria */}
        <hr className="my-4" style={{ borderColor: '#ffc107', opacity: 0.3 }} />

        {/* Copyright y enlaces legales */}
        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start">
            <p className="mb-0">
              &copy; {year} DJ Josepe. Todos los derechos reservados.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <a href="/privacy" className="text-light text-decoration-none me-3">
              Política de Privacidad
            </a>
            <a href="/terms" className="text-light text-decoration-none">
              Términos de Servicio
            </a>
          </div>
        </div>
      </div>

      {/* Efectos de fondo */}
      <style jsx>{`
        footer {
          position: relative;
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
        }

        footer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4);
          background-size: 400% 400%;
          animation: gradientShift 3s ease-in-out infinite;
        }

        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @media (max-width: 768px) {
          .col-md-4 {
            text-align: center;
          }
        }
      `}</style>
    </motion.footer>
  );
}

