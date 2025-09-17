'use client';

import { useState, useMemo } from 'react';

const DataTable = ({ 
  data = [], 
  columns = [], 
  loading = false,
  searchable = true,
  sortable = true,
  pagination = true,
  pageSize = 10,
  actions = null,
  onRowClick = null,
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);

  // Filtrar datos basado en búsqueda
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    
    return data.filter(row => 
      columns.some(column => {
        const value = row[column.key];
        return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [data, searchTerm, columns]);

  // Ordenar datos
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Paginar datos
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize, pagination]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const handleSort = (columnKey) => {
    if (!sortable) return;
    
    setSortConfig(current => ({
      key: columnKey,
      direction: current.key === columnKey && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <i className="bi bi-arrow-down-up text-muted"></i>;
    }
    return (
      <i className={`bi bi-arrow-${sortConfig.direction === 'asc' ? 'up' : 'down'} text-warning`}></i>
    );
  };

  const renderPagination = () => {
    if (!pagination || totalPages <= 1) return null;
    
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return (
      <nav aria-label="Paginación de tabla">
        <ul className="pagination justify-content-center mb-0">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button 
              className="page-link bg-dark text-warning border-warning"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <i className="bi bi-chevron-left"></i>
            </button>
          </li>
          
          {startPage > 1 && (
            <>
              <li className="page-item">
                <button 
                  className="page-link bg-dark text-light border-secondary"
                  onClick={() => handlePageChange(1)}
                >
                  1
                </button>
              </li>
              {startPage > 2 && (
                <li className="page-item disabled">
                  <span className="page-link bg-dark text-muted border-secondary">...</span>
                </li>
              )}
            </>
          )}
          
          {pages.map(page => (
            <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
              <button 
                className={`page-link ${
                  currentPage === page 
                    ? 'bg-warning text-dark border-warning' 
                    : 'bg-dark text-light border-secondary'
                }`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            </li>
          ))}
          
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && (
                <li className="page-item disabled">
                  <span className="page-link bg-dark text-muted border-secondary">...</span>
                </li>
              )}
              <li className="page-item">
                <button 
                  className="page-link bg-dark text-light border-secondary"
                  onClick={() => handlePageChange(totalPages)}
                >
                  {totalPages}
                </button>
              </li>
            </>
          )}
          
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button 
              className="page-link bg-dark text-warning border-warning"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <i className="bi bi-chevron-right"></i>
            </button>
          </li>
        </ul>
      </nav>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <div className="mt-2 text-muted">Cargando datos...</div>
      </div>
    );
  }

  return (
    <div className={`data-table ${className}`}>
      {/* Header con búsqueda y estadísticas */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center gap-3">
          {searchable && (
            <div className="position-relative">
              <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
              <input
                type="text"
                className="form-control bg-dark text-light border-secondary ps-5"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ minWidth: '250px' }}
              />
            </div>
          )}
          
          <div className="text-muted small">
            Mostrando {paginatedData.length} de {sortedData.length} registros
            {searchTerm && ` (filtrados de ${data.length} totales)`}
          </div>
        </div>
        
        {pagination && (
          <div className="d-flex align-items-center gap-2">
            <label className="text-muted small">Filas por página:</label>
            <select 
              className="form-select form-select-sm bg-dark text-light border-secondary"
              value={pageSize}
              onChange={(e) => {
                setCurrentPage(1);
                // En un componente real, esto debería ser una prop
              }}
              style={{ width: 'auto' }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        )}
      </div>

      {/* Tabla */}
      <div className="table-responsive">
        <table className="table table-dark table-hover">
          <thead className="table-warning">
            <tr>
              {columns.map((column) => (
                <th 
                  key={column.key} 
                  scope="col"
                  className={sortable ? 'cursor-pointer user-select-none' : ''}
                  onClick={() => handleSort(column.key)}
                  style={{ minWidth: column.width || 'auto' }}
                >
                  <div className="d-flex align-items-center justify-content-between">
                    <span>{column.label}</span>
                    {sortable && getSortIcon(column.key)}
                  </div>
                </th>
              ))}
              {actions && <th scope="col" className="text-center">Acciones</th>}
            </tr>
          </thead>
          
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="text-center py-5">
                  <i className="bi bi-inbox fs-1 text-muted mb-3 d-block"></i>
                  <div className="text-muted">
                    {searchTerm ? 'No se encontraron resultados' : 'No hay datos disponibles'}
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => (
                <tr 
                  key={row.id || index} 
                  className={onRowClick ? 'cursor-pointer' : ''}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {columns.map((column) => (
                    <td key={column.key}>
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </td>
                  ))}
                  {actions && (
                    <td className="text-center">
                      {actions(row)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {renderPagination()}
      
      <style jsx>{`
        .cursor-pointer {
          cursor: pointer;
        }
        
        .data-table .table th {
          border-top: none;
          border-bottom: 2px solid #ffc107;
          font-weight: 600;
        }
        
        .data-table .table td {
          vertical-align: middle;
        }
        
        .data-table .table-hover tbody tr:hover {
          background-color: rgba(255, 193, 7, 0.1);
        }
        
        .form-control:focus {
          border-color: #ffc107;
          box-shadow: 0 0 0 0.2rem rgba(255, 193, 7, 0.25);
        }
      `}</style>
    </div>
  );
};

export default DataTable;