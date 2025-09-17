"use client";
// Importamos el componente que tiene toda la lógica.
// Asegúrate de que la ruta a tu componente SetsGrid.js sea la correcta.
import SetsGrid from '../../../components/public/SetsGrid'; 

export default function Page() {
  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="display-4">Sets Musicales</h1>
        <p className="lead text-muted">Explora las últimas sesiones y mixes.</p>
      </div>
      
      {/* Aquí renderizamos el componente que hará todo el trabajo pesado */}
      <SetsGrid />
    </div>
  );
}