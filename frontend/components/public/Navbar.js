'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [pathname, setPathname] = useState('/');

  useEffect(() => {
    // Solo en cliente
    if (typeof window !== 'undefined') {
      setPathname(window.location.pathname);
    }
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top compact-navbar">
      <div className="container-fluid">
        <Link href="/home" className="navbar-brand fw-bold d-flex align-items-center ms-0 ps-3">
          <img
            src="/logo_blanco.png"
            alt="DJ Josepe Logo"
            width="36"
            height="36"
            className="me-2"
          />
          DJ&nbsp;JOSEPE
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
          data-bs-target="#navbarNav" aria-controls="navbarNav"
          aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link href="/home" className={`nav-link spectacular-link${pathname === '/home' ? ' active' : ''}`}>
                Home
              </Link>
            </li>

            {/* Enlaces a páginas separadas */}
            <li className="nav-item">
              <Link href="/sets" className={`nav-link spectacular-link${pathname === '/sets' ? ' active' : ''}`}>Sets</Link>
            </li>
            <li className="nav-item">
              <Link href="/events" className={`nav-link spectacular-link${pathname === '/events' ? ' active' : ''}`}>Eventos</Link>
            </li>
          
            <li className="nav-item">
              <Link href="/gallery" className={`nav-link spectacular-link${pathname === '/gallery' ? ' active' : ''}`}>
                Galería
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/contact" className={`nav-link spectacular-link${pathname === '/contact' ? ' active' : ''}`}>
                Contacto
              </Link>
            </li>

            {/* Si necesitas mostrar Admin cuando hay token, mantenlo como lo tenías */}
            {/* {isAuthenticated && (
              <li className="nav-item">
                <Link href="/admin/dashboard" className="nav-link">
                  <i className="fas fa-cog me-1"></i> Admin
                </Link>
              </li>
            )} */}
          </ul>
        </div>
      </div>

      {/* Estilos para efectos espectaculares */}
      <style jsx>{`
        /* Navbar con fondo negro en todas las páginas */
        .navbar {
          background: #000000 !important;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          min-height: 3.5rem;
          padding-top: 0.25rem;
          padding-bottom: 0.25rem;
        }
        
        .compact-navbar {
          height: 3.5rem;
          max-height: 3.5rem;
        }
        
        .spectacular-link {
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          background: linear-gradient(45deg, transparent 0%, transparent 100%);
          background-size: 200% 200%;
          border-radius: 8px;
          padding: 6px 14px !important;
          margin: 0 4px;
        }

        .spectacular-link::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, 
            transparent 0%, 
            rgba(255, 255, 255, 0.3) 50%, 
            transparent 100%);
          transition: left 0.6s ease;
        }

        .spectacular-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 3px;
          background: linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1);
          transition: all 0.4s ease;
          transform: translateX(-50%);
          border-radius: 2px;
        }

        /* Efectos al pasar el mouse */
        .spectacular-link:hover {
          color: #fff !important;
          text-shadow: 0 0 15px rgba(255, 255, 255, 0.8);
          transform: translateY(-3px) scale(1.05);
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        }

        .spectacular-link:hover::before {
          left: 100%;
        }

        .spectacular-link:hover::after {
          width: 100%;
        }

        /* EFECTOS AL HACER CLICK */
        .spectacular-link:active {
          transform: translateY(0) scale(0.95) !important;
          background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1) !important;
          color: white !important;
          text-shadow: 0 0 20px rgba(255, 255, 255, 1) !important;
          box-shadow: 0 0 30px rgba(255, 107, 107, 0.6), 
                      0 0 40px rgba(78, 205, 196, 0.4),
                      0 0 50px rgba(69, 183, 209, 0.3) !important;
          transition: all 0.1s ease !important;
        }

        .spectacular-link:active::after {
          width: 100% !important;
          height: 100% !important;
          top: 0 !important;
          background: rgba(255, 255, 255, 0.2) !important;
          border-radius: 8px !important;
        }

        /* Animación de pulso al hacer click */
        @keyframes clickPulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }

        .spectacular-link:focus {
          animation: clickPulse 0.3s ease;
          outline: none;
        }

        /* Animación de entrada para el menú móvil */
        .navbar-collapse {
          transition: all 0.5s ease;
        }

        .navbar-collapse.show .nav-item {
          animation: slideInFromRight 0.6s ease forwards;
          opacity: 0;
          transform: translateX(50px);
        }

        .navbar-collapse.show .nav-item:nth-child(1) { animation-delay: 0.1s; }
        .navbar-collapse.show .nav-item:nth-child(2) { animation-delay: 0.2s; }
        .navbar-collapse.show .nav-item:nth-child(3) { animation-delay: 0.3s; }
        .navbar-collapse.show .nav-item:nth-child(4) { animation-delay: 0.4s; }
        .navbar-collapse.show .nav-item:nth-child(5) { animation-delay: 0.5s; }
        .navbar-collapse.show .nav-item:nth-child(6) { animation-delay: 0.6s; }
        .navbar-collapse.show .nav-item:nth-child(7) { animation-delay: 0.7s; }

        @keyframes slideInFromRight {
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </nav>
  );
}
