'use client';

import { useEffect, useState } from 'react';
import { z } from 'zod';
import setsService from '../../services/setsService';

// Zod schema for set validation
const setSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().optional(),
  genre: z.string().optional(),
  duration: z.number().optional(),
  createdAt: z.string().optional(),
  coverPhoto: z.object({
    url: z.string().optional(),
    alt: z.string().optional()
  }).optional(),
  playCount: z.number().optional(),
  downloadCount: z.number().optional()
});

/**
 * SetsGrid - Componente refactorizado para mostrar sets musicales
 * Integrado con el backend MySQL y validación Zod
 */
export default function SetsGrid() {
  const [sets, setSets] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0
  });

  useEffect(() => {
    loadSets();
  }, [activeFilter, pagination.page]);

  const loadSets = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...(activeFilter !== 'all' && { genre: activeFilter })
      };

      const response = await setsService.getSets(params);

      // Validate response data with Zod
      const validatedSets = (response.data || []).map(set => {
        try {
          return setSchema.parse(set);
        } catch (validationError) {
          console.warn('Invalid set data:', validationError);
          return null;
        }
      }).filter(Boolean);

      setSets(validatedSets);

      if (response.pagination) {
        setPagination(prev => ({
          ...prev,
          total: response.pagination.total || 0
        }));
      }

    } catch (err) {
      console.error('Error loading sets:', err);
      setError('Error al cargar los sets. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaySet = async (setId) => {
    try {
      await setsService.incrementPlayCount(setId);
      // Update play count in local state
      setSets(prev => prev.map(set =>
        set.id === setId
          ? { ...set, playCount: (set.playCount || 0) + 1 }
          : set
      ));

      // Here you would implement actual audio playback
      alert('Funcionalidad de reproducción en desarrollo');
    } catch (err) {
      console.error('Error incrementing play count:', err);
    }
  };

  const handleDownloadSet = async (setId) => {
    try {
      await setsService.incrementDownloadCount(setId);
      // Update download count in local state
      setSets(prev => prev.map(set =>
        set.id === setId
          ? { ...set, downloadCount: (set.downloadCount || 0) + 1 }
          : set
      ));

      // Here you would implement actual download functionality
      alert('Funcionalidad de descarga en desarrollo');
    } catch (err) {
      console.error('Error incrementing download count:', err);
    }
  };

  const filters = [
    { key: 'all', label: 'Todos' },
    { key: 'house', label: 'House' },
    { key: 'techno', label: 'Techno' },
    { key: 'progressive', label: 'Progressive' },
    { key: 'deep', label: 'Deep House' },
    { key: 'trance', label: 'Trance' },
    { key: 'minimal', label: 'Minimal' }
  ];

  const filteredSets = sets;

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  return (
    <div className="sets-grid">
      {/* Filter Tabs */}
      <div className="filter-tabs mb-4">
        <ul className="nav nav-pills justify-content-center" role="tablist">
          {filters.map((filter) => (
            <li className="nav-item" role="presentation" key={filter.key}>
              <button
                type="button"
                className={`nav-link${activeFilter === filter.key ? ' active' : ''}`}
                onClick={() => {
                  setActiveFilter(filter.key);
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
              >
                {filter.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-warning" role="status">
            <span className="visually-hidden">Cargando sets...</span>
          </div>
          <p className="text-muted mt-3">Cargando sets musicales...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="alert alert-danger" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
          <button
            className="btn btn-outline-danger btn-sm ms-3"
            onClick={loadSets}
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Sets Grid */}
      {!loading && !error && (
        <>
          <div className="row g-4">
            {filteredSets.length > 0 ? (
              filteredSets.map((set) => (
                <div className="col-lg-4 col-md-6" key={set.id}>
                  <div className="card card-dark h-100">
                    {set.coverPhoto?.url && (
                      <img
                        src={set.coverPhoto.url}
                        alt={set.coverPhoto.alt || set.title}
                        className="card-img-top"
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                    )}
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title text-warning">{set.title}</h5>
                      {set.description && (
                        <p className="card-text flex-grow-1">{set.description}</p>
                      )}

                      <div className="mb-3">
                        {set.genre && (
                          <span className="badge bg-primary me-2">{set.genre}</span>
                        )}
                        <p className="text-muted mb-1">
                          <i className="fas fa-calendar me-1"></i>{' '}
                          {set.createdAt
                            ? new Date(set.createdAt).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })
                            : 'Fecha no disponible'
                          }
                        </p>
                        <p className="text-muted mb-1">
                          <i className="fas fa-clock me-1"></i>{' '}
                          {set.duration
                            ? `${Math.floor(set.duration / 60)}:${(set.duration % 60)
                              .toString()
                              .padStart(2, '0')}`
                            : '--:--'}
                        </p>

                        {/* Stats */}
                        <div className="d-flex justify-content-between text-muted small">
                          <span>
                            <i className="fas fa-play me-1"></i>
                            {set.playCount || 0} reproducciones
                          </span>
                          <span>
                            <i className="fas fa-download me-1"></i>
                            {set.downloadCount || 0} descargas
                          </span>
                        </div>
                      </div>

                      <div className="d-flex justify-content-between mt-auto">
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => handlePlaySet(set.id)}
                        >
                          <i className="fas fa-play"></i> Reproducir
                        </button>
                        <button
                          className="btn btn-outline-warning btn-sm"
                          onClick={() => handleDownloadSet(set.id)}
                        >
                          <i className="fas fa-download"></i> Descargar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center py-5">
                <i className="fas fa-music fa-3x text-muted mb-3"></i>
                <h4 className="text-muted">
                  {activeFilter === 'all'
                    ? 'Aún no se han subido sets musicales.'
                    : `No hay sets del género ${filters.find((f) => f.key === activeFilter)?.label}.`}
                </h4>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <nav aria-label="Sets pagination">
                <ul className="pagination">
                  <li className={`page-item ${pagination.page <= 1 ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page <= 1}
                    >
                      Anterior
                    </button>
                  </li>

                  {[...Array(Math.min(5, totalPages))].map((_, index) => {
                    const pageNum = Math.max(1, pagination.page - 2) + index;
                    if (pageNum > totalPages) return null;

                    return (
                      <li key={pageNum} className={`page-item ${pagination.page === pageNum ? 'active' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </button>
                      </li>
                    );
                  })}

                  <li className={`page-item ${pagination.page >= totalPages ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page >= totalPages}
                    >
                      Siguiente
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
}