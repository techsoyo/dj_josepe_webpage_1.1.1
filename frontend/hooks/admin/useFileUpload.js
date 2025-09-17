// frontend/hooks/admin/useFileUpload.js
'use client';

import { useState, useCallback } from 'react';
import fileService from '../../services/fileService';

/**
 * Hook personalizado para manejar subida de archivos
 * @param {Object} options - Opciones de configuración
 * @returns {Object} - Estado y funciones de subida
 */
export function useFileUpload(options = {}) {
  const [uploadState, setUploadState] = useState({
    uploading: false,
    progress: 0,
    error: null,
    success: false,
    uploadedFiles: []
  });

  const {
    maxFiles = 5,
    maxSize = 10 * 1024 * 1024, // 10MB por defecto
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    autoUpload = true,
    folder = 'general'
  } = options;

  // Función para validar archivo antes de subir
  const validateFile = useCallback((file) => {
    const errors = [];

    // Validar tamaño
    if (file.size > maxSize) {
      errors.push(`El archivo es demasiado grande. Máximo: ${Math.round(maxSize / 1024 / 1024)}MB`);
    }

    // Validar tipo
    if (!allowedTypes.includes(file.type)) {
      const allowedExtensions = allowedTypes.map(type => type.split('/')[1]).join(', ');
      errors.push(`Tipo de archivo no permitido. Permitidos: ${allowedExtensions}`);
    }

    // Validar número máximo de archivos
    if (uploadState.uploadedFiles.length >= maxFiles) {
      errors.push(`Máximo ${maxFiles} archivos permitidos`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }, [maxSize, allowedTypes, maxFiles, uploadState.uploadedFiles.length]);

  // Función para subir un archivo
  const uploadFile = useCallback(async (file, type = 'image') => {
    try {
      setUploadState(prev => ({
        ...prev,
        uploading: true,
        progress: 0,
        error: null,
        success: false
      }));

      // Validar archivo
      const validation = validateFile(file);
      if (!validation.isValid) {
        throw new Error(validation.errors.join('. '));
      }

      // Subir archivo usando el servicio
      const result = await fileService.uploadFile(file, type, folder);

      // Actualizar estado
      setUploadState(prev => ({
        ...prev,
        uploading: false,
        progress: 100,
        success: true,
        uploadedFiles: [...prev.uploadedFiles, {
          ...result,
          originalName: file.name,
          size: file.size,
          type: file.type,
          uploadedAt: new Date()
        }]
      }));

      return result;
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadState(prev => ({
        ...prev,
        uploading: false,
        progress: 0,
        error: error.message || 'Error al subir el archivo',
        success: false
      }));
      throw error;
    }
  }, [validateFile, folder]);

  // Función para subir múltiples archivos
  const uploadFiles = useCallback(async (files, type = 'image') => {
    const results = [];
    const errors = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      try {
        setUploadState(prev => ({
          ...prev,
          progress: Math.round((i / files.length) * 100)
        }));

        const result = await uploadFile(file, type);
        results.push(result);
      } catch (error) {
        errors.push({
          file: file.name,
          error: error.message
        });
      }
    }

    setUploadState(prev => ({
      ...prev,
      progress: 100
    }));

    return {
      results,
      errors,
      success: errors.length === 0
    };
  }, [uploadFile]);

  // Función para eliminar archivo subido
  const deleteUploadedFile = useCallback(async (filePath) => {
    try {
      await fileService.deleteFile(filePath);

      setUploadState(prev => ({
        ...prev,
        uploadedFiles: prev.uploadedFiles.filter(file => file.path !== filePath)
      }));

      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      setUploadState(prev => ({
        ...prev,
        error: error.message || 'Error al eliminar el archivo'
      }));
      return false;
    }
  }, []);

  // Función para limpiar estado
  const clearUploadState = useCallback(() => {
    setUploadState({
      uploading: false,
      progress: 0,
      error: null,
      success: false,
      uploadedFiles: []
    });
  }, []);

  // Función para obtener URL completa de archivo
  const getFileUrl = useCallback((filePath) => {
    return fileService.getFileUrl(filePath);
  }, []);

  return {
    // Estado
    uploading: uploadState.uploading,
    progress: uploadState.progress,
    error: uploadState.error,
    success: uploadState.success,
    uploadedFiles: uploadState.uploadedFiles,

    // Funciones principales
    uploadFile,
    uploadFiles,
    deleteUploadedFile,
    clearUploadState,
    validateFile,
    getFileUrl,

    // Helpers
    hasFiles: uploadState.uploadedFiles.length > 0,
    hasError: !!uploadState.error,
    canUploadMore: uploadState.uploadedFiles.length < maxFiles,
    remainingSlots: maxFiles - uploadState.uploadedFiles.length,

    // Configuración
    config: {
      maxFiles,
      maxSize,
      allowedTypes,
      autoUpload,
      folder
    }
  };
}

/**
 * Hook personalizado para drag & drop de archivos
 * @param {Object} options - Opciones de configuración
 * @returns {Object} - Estado y funciones de drag & drop
 */
export function useFileDrop(options = {}) {
  const [dropState, setDropState] = useState({
    isDragging: false,
    files: [],
    error: null
  });

  const { maxFiles = 5, allowedTypes = ['image/*'] } = options;

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDropState(prev => ({ ...prev, isDragging: true }));
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDropState(prev => ({ ...prev, isDragging: false }));
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    setDropState(prev => ({ ...prev, isDragging: false }));

    const files = Array.from(e.dataTransfer.files);

    if (files.length > maxFiles) {
      setDropState(prev => ({
        ...prev,
        error: `Máximo ${maxFiles} archivos permitidos`
      }));
      return;
    }

    // Validar tipos de archivo
    const invalidFiles = files.filter(file => {
      return !allowedTypes.some(type => {
        if (type.endsWith('/*')) {
          return file.type.startsWith(type.slice(0, -1));
        }
        return file.type === type;
      });
    });

    if (invalidFiles.length > 0) {
      setDropState(prev => ({
        ...prev,
        error: 'Algunos archivos tienen formato no válido'
      }));
      return;
    }

    setDropState(prev => ({
      ...prev,
      files,
      error: null
    }));
  }, [maxFiles, allowedTypes]);

  const clearFiles = useCallback(() => {
    setDropState({
      isDragging: false,
      files: [],
      error: null
    });
  }, []);

  return {
    // Estado
    isDragging: dropState.isDragging,
    files: dropState.files,
    error: dropState.error,

    // Handlers
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,

    // Funciones
    clearFiles,

    // Helpers
    hasFiles: dropState.files.length > 0,
    hasError: !!dropState.error
  };
}
