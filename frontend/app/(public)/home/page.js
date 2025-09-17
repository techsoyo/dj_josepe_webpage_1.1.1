"use client";

import VideoSection from '../../../components/public/VideoSection';
export default function HomePage() {
  return (
    <main className="bg-black">
      {/* VideoSection incluye la sección Sobre Mi completa con todos los efectos */}
      <VideoSection />

      {/* Estilos para las clases h-screen y relative */}
      <style jsx>{`
        .h-screen {
          height: 100vh;
        }

        .relative {
          position: relative;
        }

        .bg-black {
          background-color: #000000;
        }

        /* Asegurar que las secciones ocupen toda la altura de la pantalla */
        section {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        /* Estilos adicionales para mejor presentación */
        main {
          min-height: 100vh;
        }
      `}</style>
    </main>
  );
}
