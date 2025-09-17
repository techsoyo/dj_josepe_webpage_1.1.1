'use client';

import { useState, useEffect } from 'react';
import FileUpload from './FileUpload';
import DataTable from './DataTable';

const GalleryManager = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' o 'table'
  const [filter, setFilter] = useState('all'); // 'all', 'recent', 'featured'

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/gallery`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setImages(data.images || []);
      }
    } catch (error) {
      console.error('Error obteniendo imágenes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (uploadResults) => {
    setUploading(true);
    
    try {
      const newImages = Array.isArray(uploadResults) ? uploadResults : [uploadResults];
      
      // Procesar cada imagen subida
      for (const result of newImages) {
        if (result.success && result.url) {
          const imageData = {
            title: result.file.name.split('.')[0],
            url: result.url,
            size: result.file.size,
            type: result.file.type,
            featured: false
          };
          
          const token = localStorage.getItem('token');
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/gallery`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(imageData)
          });
          
          if (response.ok) {
            const newImage = await response.json();
            setImages(prev => [newImage, ...prev]);
          }
        }
      }
      
    } catch (error) {
      console.error('Error guardando imágenes:', error);
      alert('Error al guardar las imágenes en la base de datos');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta imagen?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/gallery/${imageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        setImages(prev => prev.filter(img => img.id !== imageId));
        setSelectedImages(prev => prev.filter(id => id !== imageId));
      }
    } catch (error) {
      console.error('Error eliminando imagen:', error);
      alert('Error al eliminar la imagen');
    }
  };

  const handleToggleFeatured = async (imageId, featured) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/gallery/${imageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ featured })
      });
      
      if (response.ok) {
        setImages(prev => 
          prev.map(img => 
            img.id === imageId ? { ...img, featured } : img
          )
        );
      }
    } catch (error) {
      console.error('Error actualizando imagen:', error);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedImages.length === 0) return;
    
    if (!confirm(`¿Estás seguro de que quieres eliminar ${selectedImages.length} imágenes?`)) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      await Promise.all(
        selectedImages.map(imageId => 
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/gallery/${imageId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          })
        )
      );
      
      setImages(prev => prev.filter(img => !selectedImages.includes(img.id)));
      setSelectedImages([]);
    } catch (error) {
      console.error('Error en eliminación masiva:', error);
    }
  };

  const filteredImages = images.filter(image => {
    if (filter === 'recent') {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return new Date(image.createdAt) > weekAgo;
    }
    if (filter === 'featured') {
      return image.featured;
    }
    return true;
  });

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const tableColumns = [
    {
      key: 'thumbnail',
      label: 'Vista previa',
      width: '80px',
      render: (value, row) => (
        <img 
          src={row.url} 
          alt={row.title}
          className="rounded"
          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
        />
      )
    },
    { key: 'title', label: 'Título' },
    { 
      key: 'size', 
      label: 'Tamaño',
      render: (size) => formatFileSize(size)
    },
    {
      key: 'featured',
      label: 'Destacada',
      render: (featured, row) => (
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            checked={featured}
            onChange={(e) => handleToggleFeatured(row.id, e.target.checked)}
          />
        </div>
      )
    },
    {
      key: 'createdAt',
      label: 'Fecha',
      render: (date) => new Date(date).toLocaleDateString('es-ES')
    }
  ];

  return (
    <div className="gallery-manager">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-warning mb-0">
          <i className="bi bi-images me-2"></i>
          Galería
        </h2>
        
        <div className="d-flex gap-2">
          <div className="btn-group" role="group">
            <button
              className={`btn btn-sm ${viewMode === 'grid' ? 'btn-warning' : 'btn-outline-warning'}`}
              onClick={() => setViewMode('grid')}
            >
              <i className="bi bi-grid-3x3-gap"></i>
            </button>
            <button
              className={`btn btn-sm ${viewMode === 'table' ? 'btn-warning' : 'btn-outline-warning'}`}
              onClick={() => setViewMode('table')}
            >
              <i className="bi bi-list"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div className="mb-4">
        <FileUpload
          accept="image/*"
          multiple={true}
          maxSize={10 * 1024 * 1024} // 10MB
          uploadUrl={`${process.env.NEXT_PUBLIC_API_URL}/admin/gallery/upload`}
          onUpload={handleImageUpload}
          onError={(errors) => {
            console.error('Error subiendo imágenes:', errors);
            alert('Error: ' + errors.join(', '));
          }}
        />
      </div>

      {/* Filters */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex gap-2">
          <div className="btn-group" role="group">
            <button
              className={`btn btn-sm ${filter === 'all' ? 'btn-warning' : 'btn-outline-warning'}`}
              onClick={() => setFilter('all')}
            >
              Todas ({images.length})
            </button>
            <button
              className={`btn btn-sm ${filter === 'recent' ? 'btn-warning' : 'btn-outline-warning'}`}
              onClick={() => setFilter('recent')}
            >
              Recientes
            </button>
            <button
              className={`btn btn-sm ${filter === 'featured' ? 'btn-warning' : 'btn-outline-warning'}`}
              onClick={() => setFilter('featured')}
            >
              Destacadas
            </button>
          </div>
        </div>
        
        {selectedImages.length > 0 && (
          <div className="d-flex gap-2">
            <span className="text-warning small">
              {selectedImages.length} seleccionadas
            </span>
            <button 
              className="btn btn-outline-danger btn-sm"
              onClick={handleBulkDelete}
            >
              <i className="bi bi-trash me-1"></i>
              Eliminar
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-warning" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="row g-3">
          {filteredImages.map((image) => (
            <div key={image.id} className="col-lg-3 col-md-4 col-sm-6">
              <div className="card bg-dark border-secondary h-100">
                <div className="position-relative">
                  <img
                    src={image.url}
                    alt={image.title}
                    className="card-img-top"
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  
                  <div className="position-absolute top-0 end-0 p-2">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={selectedImages.includes(image.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedImages(prev => [...prev, image.id]);
                          } else {
                            setSelectedImages(prev => prev.filter(id => id !== image.id));
                          }
                        }}
                      />
                    </div>
                  </div>
                  
                  {image.featured && (
                    <div className="position-absolute bottom-0 start-0 p-2">
                      <span className="badge bg-warning text-dark">
                        <i className="bi bi-star-fill"></i>
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="card-body">
                  <h6 className="card-title text-warning">{image.title}</h6>
                  <small className="text-muted">
                    {formatFileSize(image.size)} • {new Date(image.createdAt).toLocaleDateString('es-ES')}
                  </small>
                  
                  <div className="d-flex gap-1 mt-2">
                    <button
                      className="btn btn-sm btn-outline-warning flex-fill"
                      onClick={() => handleToggleFeatured(image.id, !image.featured)}
                    >
                      <i className={`bi ${image.featured ? 'bi-star-fill' : 'bi-star'}`}></i>
                    </button>
                    
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDeleteImage(image.id)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <DataTable
          data={filteredImages}
          columns={tableColumns}
          loading={loading}
          actions={(row) => (
            <div className="d-flex gap-1">
              <button
                className="btn btn-sm btn-outline-warning"
                onClick={() => handleToggleFeatured(row.id, !row.featured)}
                title={row.featured ? 'Quitar de destacadas' : 'Marcar como destacada'}
              >
                <i className={`bi ${row.featured ? 'bi-star-fill' : 'bi-star'}`}></i>
              </button>
              
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => handleDeleteImage(row.id)}
                title="Eliminar imagen"
              >
                <i className="bi bi-trash"></i>
              </button>
            </div>
          )}
        />
      )}
    </div>
  );
};

export default GalleryManager;