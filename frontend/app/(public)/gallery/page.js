"use client";

import { useEffect } from 'react';
import Link from 'next/link';

export default function GalleryPage() {
  useEffect(() => {
    // Animación de entrada desde abajo
    const galleryContainer = document.querySelector('.gallery-container');
    if (galleryContainer) {
      galleryContainer.style.transform = 'translateY(100%)';
      galleryContainer.style.opacity = '0';

      setTimeout(() => {
        galleryContainer.style.transform = 'translateY(0)';
        galleryContainer.style.opacity = '1';
        galleryContainer.classList.add('slide-in');
      }, 100);
    }
  }, []);

  return (
    <div className="gallery-page">
      {/* Hero Section */}
      <section
        className="gallery-hero d-flex align-items-center justify-content-center text-center py-5"
        style={{
          minHeight: '40vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#fff',
          position: 'relative',
          paddingTop: '6rem',
        }}
      >
        <div className="container">
          <h1 className="display-3 fw-bold">
            <i className="fas fa-images me-3"></i>
            Galería
          </h1>
          <p className="lead">
            Momentos únicos capturados en cada evento
          </p>
        </div>
      </section>

      {/* Contenido principal */}
      <section
        className="gallery-container section bg-dark text-light"
        style={{
          transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          overflow: 'hidden'
        }}
      >
        <div className="container">
          <div className="row mb-5">
            <div className="col-lg-8 mx-auto text-center">
              <h2 className="text-warning display-6 fw-bold mb-4">Recuerdos en Imágenes</h2>
              <p className="lead">
                Cada evento es una historia visual. Aquí encontrarás fotografías y
                recuerdos de los mejores momentos vividos en cada presentación.
              </p>
            </div>
          </div>

          {/* Placeholder de galería */}
          <div className="gallery-grid">
            <div className="row">
              <div className="col-md-4 mb-4">
                <div className="gallery-item">
                  <div className="placeholder-image">
                    <i className="fas fa-music fa-3x text-warning"></i>
                    <p className="mt-3">Próximamente</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4 mb-4">
                <div className="gallery-item">
                  <div className="placeholder-image">
                    <i className="fas fa-headphones fa-3x text-warning"></i>
                    <p className="mt-3">En desarrollo</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4 mb-4">
                <div className="gallery-item">
                  <div className="placeholder-image">
                    <i className="fas fa-calendar-alt fa-3x text-warning"></i>
                    <p className="mt-3">Muy pronto</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-5">
              <p className="lead text-warning">
                ¡Mantente atento! Pronto encontrarás aquí fotografías y recuerdos
                de nuestros eventos más espectaculares.
              </p>
              <Link href="/events" className="btn btn-warning btn-lg me-3">
                <i className="fas fa-calendar me-2"></i>
                Ver Próximos Eventos
              </Link>
              <Link href="/contact" className="btn btn-outline-light btn-lg">
                <i className="fas fa-envelope me-2"></i>
                Contratar DJ
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Estilos específicos */}
      <style jsx>{`
        .gallery-container.slide-in {
          animation: slideInFromBottom 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        
        .gallery-grid {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s ease;
        }
        
        .gallery-container.slide-in .gallery-grid {
          animation: slideInUp 0.8s ease 0.3s forwards;
        }
        
        .gallery-item {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 193, 7, 0.2);
          border-radius: 8px;
          transition: all 0.3s ease;
          overflow: hidden;
        }
        
        .gallery-item:hover {
          background: rgba(255, 193, 7, 0.1);
          border-color: var(--primary-color);
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(255, 193, 7, 0.2);
        }
        
        .placeholder-image {
          height: 250px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.02);
        }
        
        @keyframes slideInFromBottom {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes slideInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .gallery-hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 30% 70%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}