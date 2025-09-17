'use client';

import { useState, useRef } from 'react';

const FileUpload = ({ 
  accept = '*/*',
  multiple = false,
  maxSize = 5 * 1024 * 1024, // 5MB
  onUpload,
  onError,
  uploadUrl = null,
  className = '',
  children
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    const errors = [];
    
    // Validar tamaño
    if (file.size > maxSize) {
      errors.push(`El archivo "${file.name}" excede el tamaño máximo de ${formatFileSize(maxSize)}`);
    }
    
    // Validar tipo (si se especifica)
    if (accept !== '*/*') {
      const acceptedTypes = accept.split(',').map(type => type.trim());
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      const mimeType = file.type;
      
      const isAccepted = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return type === fileExtension;
        }
        if (type.includes('*')) {
          const baseType = type.split('/')[0];
          return mimeType.startsWith(baseType);
        }
        return type === mimeType;
      });
      
      if (!isAccepted) {
        errors.push(`El archivo "${file.name}" no es un tipo de archivo válido`);
      }
    }
    
    return errors;
  };

  const handleFileSelect = async (files) => {
    const fileList = Array.from(files);
    
    // Validar archivos
    const allErrors = [];
    fileList.forEach(file => {
      const errors = validateFile(file);
      allErrors.push(...errors);
    });
    
    if (allErrors.length > 0) {
      onError && onError(allErrors);
      return;
    }
    
    // Subir archivos
    if (uploadUrl) {
      await uploadFiles(fileList);
    } else {
      // Solo pasar los archivos al callback
      onUpload && onUpload(multiple ? fileList : fileList[0]);
    }
  };

  const uploadFiles = async (files) => {
    setUploading(true);
    setUploadProgress(0);
    
    try {
      const token = localStorage.getItem('token');
      const results = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);
        
        // Crear XMLHttpRequest para monitorear progreso
        const xhr = new XMLHttpRequest();
        
        const uploadPromise = new Promise((resolve, reject) => {
          xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
              const fileProgress = (event.loaded / event.total) * 100;
              const totalProgress = ((i / files.length) * 100) + (fileProgress / files.length);
              setUploadProgress(Math.round(totalProgress));
            }
          });
          
          xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                const response = JSON.parse(xhr.responseText);
                resolve(response);
              } catch {
                resolve({ success: true, url: null });
              }
            } else {
              reject(new Error(`Error ${xhr.status}: ${xhr.statusText}`));
            }
          });
          
          xhr.addEventListener('error', () => {
            reject(new Error('Error de red durante la subida'));
          });
          
          xhr.open('POST', uploadUrl);
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
          xhr.send(formData);
        });
        
        const result = await uploadPromise;
        results.push({ file, ...result });
      }
      
      setUploadProgress(100);
      onUpload && onUpload(multiple ? results : results[0]);
      
    } catch (error) {
      console.error('Error subiendo archivos:', error);
      onError && onError([error.message]);
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      if (!multiple && files.length > 1) {
        onError && onError(['Solo se permite subir un archivo a la vez']);
        return;
      }
      handleFileSelect(files);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files);
    }
    // Limpiar input para permitir subir el mismo archivo otra vez
    e.target.value = '';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`file-upload ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleInputChange}
        style={{ display: 'none' }}
      />
      
      <div
        className={`upload-area border border-2 border-dashed rounded p-4 text-center position-relative ${
          dragOver ? 'border-warning bg-warning bg-opacity-10' : 'border-secondary'
        } ${uploading ? 'uploading' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        style={{ cursor: uploading ? 'not-allowed' : 'pointer' }}
      >
        {uploading ? (
          <div className="upload-progress">
            <div className="mb-3">
              <i className="bi bi-cloud-upload text-warning fs-1"></i>
            </div>
            <div className="mb-2">
              <strong className="text-warning">Subiendo archivos...</strong>
            </div>
            <div className="progress mb-2" style={{ height: '8px' }}>
              <div 
                className="progress-bar bg-warning" 
                role="progressbar" 
                style={{ width: `${uploadProgress}%` }}
                aria-valuenow={uploadProgress} 
                aria-valuemin="0" 
                aria-valuemax="100"
              ></div>
            </div>
            <small className="text-muted">{uploadProgress}% completado</small>
          </div>
        ) : (
          children || (
            <div className="upload-content">
              <div className="mb-3">
                <i className={`bi ${dragOver ? 'bi-cloud-upload-fill' : 'bi-cloud-upload'} text-warning fs-1`}></i>
              </div>
              <div className="mb-2">
                <strong className="text-light">
                  {dragOver ? 'Suelta los archivos aquí' : 'Arrastra archivos aquí'}
                </strong>
              </div>
              <div className="text-muted mb-3">
                o <span className="text-warning">haz clic para seleccionar</span>
              </div>
              
              <div className="upload-info">
                <small className="text-muted d-block">
                  {accept !== '*/*' && `Tipos permitidos: ${accept}`}
                </small>
                <small className="text-muted d-block">
                  Tamaño máximo: {formatFileSize(maxSize)}
                </small>
                {multiple && (
                  <small className="text-muted d-block">
                    Se pueden subir múltiples archivos
                  </small>
                )}
              </div>
            </div>
          )
        )}
      </div>
      
      <style jsx>{`
        .upload-area {
          transition: all 0.3s ease;
          min-height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .upload-area:hover:not(.uploading) {
          border-color: #ffc107;
          background-color: rgba(255, 193, 7, 0.05);
        }
        
        .upload-area.uploading {
          pointer-events: none;
        }
        
        .upload-content {
          pointer-events: none;
        }
        
        .progress {
          background-color: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
};

export default FileUpload;