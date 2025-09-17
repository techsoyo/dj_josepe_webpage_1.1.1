/**
 * Página 404 personalizada
 * Mantiene el tema dark consistente con el resto del sitio
 */
const NotFoundPage = () => {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-dark">
      <div className="text-center text-light">
        <h1 className="display-1 text-warning fw-bold">404</h1>
        <h2 className="mb-4">Página no encontrada</h2>
        <p className="text-muted mb-4">
          La página que buscas no existe o ha sido movida.
        </p>
        <a 
          href="/home" 
          className="btn btn-warning btn-lg"
        >
          🎵 Volver al inicio
        </a>
      </div>
    </div>
  );
};

export default NotFoundPage;