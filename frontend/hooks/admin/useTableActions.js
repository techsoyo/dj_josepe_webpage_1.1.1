// frontend/hooks/admin/useTableActions.js
'use client';

import { useState, useCallback } from 'react';

/**
 * Hook personalizado para manejar acciones de tablas (CRUD)
 * @param {Object} options - Opciones de configuración
 * @returns {Object} - Estado y funciones de tabla
 */
export function useTableActions(options = {}) {
  const [tableState, setTableState] = useState({
    selectedRows: new Set(),
    editingRow: null,
    deletingRows: new Set(),
    loading: false,
    error: null
  });

  const {
    onEdit,
    onDelete,
    onBulkDelete,
    onRefresh,
    multiSelect = true,
    confirmDelete = true
  } = options;

  // Seleccionar/deseleccionar fila
  const toggleRowSelection = useCallback((rowId) => {
    if (!multiSelect) return;

    setTableState(prev => {
      const newSelected = new Set(prev.selectedRows);
      if (newSelected.has(rowId)) {
        newSelected.delete(rowId);
      } else {
        newSelected.add(rowId);
      }
      return { ...prev, selectedRows: newSelected };
    });
  }, [multiSelect]);

  // Seleccionar todas las filas
  const selectAllRows = useCallback((rowIds) => {
    if (!multiSelect) return;

    setTableState(prev => ({
      ...prev,
      selectedRows: new Set(rowIds)
    }));
  }, [multiSelect]);

  // Deseleccionar todas las filas
  const clearSelection = useCallback(() => {
    setTableState(prev => ({
      ...prev,
      selectedRows: new Set()
    }));
  }, []);

  // Iniciar edición de fila
  const startEditing = useCallback((rowId) => {
    setTableState(prev => ({
      ...prev,
      editingRow: rowId
    }));
  }, []);

  // Cancelar edición
  const cancelEditing = useCallback(() => {
    setTableState(prev => ({
      ...prev,
      editingRow: null
    }));
  }, []);

  // Guardar cambios de edición
  const saveEditing = useCallback(async (rowId, data) => {
    if (!onEdit) return;

    try {
      setTableState(prev => ({ ...prev, loading: true, error: null }));

      await onEdit(rowId, data);

      setTableState(prev => ({
        ...prev,
        loading: false,
        editingRow: null
      }));

      // Refrescar datos si hay callback
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error saving row:', error);
      setTableState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Error al guardar cambios'
      }));
    }
  }, [onEdit, onRefresh]);

  // Eliminar fila individual
  const deleteRow = useCallback(async (rowId) => {
    if (!onDelete) return;

    // Confirmación si está habilitada
    if (confirmDelete && !window.confirm('¿Estás seguro de que quieres eliminar este elemento?')) {
      return;
    }

    try {
      setTableState(prev => ({
        ...prev,
        deletingRows: new Set([...prev.deletingRows, rowId]),
        error: null
      }));

      await onDelete(rowId);

      setTableState(prev => {
        const newDeleting = new Set(prev.deletingRows);
        newDeleting.delete(rowId);
        return {
          ...prev,
          deletingRows: newDeleting,
          selectedRows: new Set([...prev.selectedRows].filter(id => id !== rowId))
        };
      });

      // Refrescar datos
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error deleting row:', error);
      setTableState(prev => {
        const newDeleting = new Set(prev.deletingRows);
        newDeleting.delete(rowId);
        return {
          ...prev,
          deletingRows: newDeleting,
          error: error.message || 'Error al eliminar elemento'
        };
      });
    }
  }, [onDelete, onRefresh, confirmDelete]);

  // Eliminar múltiples filas
  const deleteSelectedRows = useCallback(async () => {
    if (!onBulkDelete || tableState.selectedRows.size === 0) return;

    if (confirmDelete && !window.confirm(`¿Estás seguro de que quieres eliminar ${tableState.selectedRows.size} elementos?`)) {
      return;
    }

    try {
      setTableState(prev => ({
        ...prev,
        deletingRows: new Set([...prev.deletingRows, ...tableState.selectedRows]),
        error: null
      }));

      await onBulkDelete(Array.from(tableState.selectedRows));

      setTableState(prev => ({
        ...prev,
        deletingRows: new Set(),
        selectedRows: new Set()
      }));

      // Refrescar datos
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error deleting selected rows:', error);
      setTableState(prev => ({
        ...prev,
        deletingRows: new Set(),
        error: error.message || 'Error al eliminar elementos'
      }));
    }
  }, [onBulkDelete, onRefresh, confirmDelete, tableState.selectedRows]);

  // Refrescar tabla
  const refreshTable = useCallback(async () => {
    if (!onRefresh) return;

    try {
      setTableState(prev => ({ ...prev, loading: true, error: null }));
      await onRefresh();
      setTableState(prev => ({ ...prev, loading: false }));
    } catch (error) {
      console.error('Error refreshing table:', error);
      setTableState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Error al refrescar tabla'
      }));
    }
  }, [onRefresh]);

  // Limpiar errores
  const clearError = useCallback(() => {
    setTableState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    // Estado
    selectedRows: tableState.selectedRows,
    editingRow: tableState.editingRow,
    deletingRows: tableState.deletingRows,
    loading: tableState.loading,
    error: tableState.error,

    // Funciones de selección
    toggleRowSelection,
    selectAllRows,
    clearSelection,
    hasSelection: tableState.selectedRows.size > 0,
    selectedCount: tableState.selectedRows.size,

    // Funciones de edición
    startEditing,
    cancelEditing,
    saveEditing,
    isEditing: !!tableState.editingRow,
    isEditingRow: (rowId) => tableState.editingRow === rowId,

    // Funciones de eliminación
    deleteRow,
    deleteSelectedRows,
    isDeletingRow: (rowId) => tableState.deletingRows.has(rowId),

    // Funciones generales
    refreshTable,
    clearError,

    // Helpers
    hasError: !!tableState.error,
    isLoading: tableState.loading,
    canDeleteSelected: tableState.selectedRows.size > 0 && !!onBulkDelete
  };
}

/**
 * Hook personalizado para paginación de tablas
 * @param {Object} options - Opciones de paginación
 * @returns {Object} - Estado y funciones de paginación
 */
export function useTablePagination(options = {}) {
  const [pagination, setPagination] = useState({
    page: options.initialPage || 1,
    pageSize: options.pageSize || 10,
    total: 0,
    totalPages: 0
  });

  const setPage = useCallback((page) => {
    setPagination(prev => ({
      ...prev,
      page: Math.max(1, Math.min(page, prev.totalPages))
    }));
  }, []);

  const setPageSize = useCallback((pageSize) => {
    setPagination(prev => ({
      ...prev,
      pageSize,
      page: 1 // Reset to first page when changing page size
    }));
  }, []);

  const setTotal = useCallback((total) => {
    setPagination(prev => ({
      ...prev,
      total,
      totalPages: Math.ceil(total / prev.pageSize)
    }));
  }, []);

  const goToFirstPage = useCallback(() => setPage(1), [setPage]);
  const goToLastPage = useCallback(() => setPage(pagination.totalPages), [setPage, pagination.totalPages]);
  const goToNextPage = useCallback(() => setPage(pagination.page + 1), [setPage, pagination.page]);
  const goToPrevPage = useCallback(() => setPage(pagination.page - 1), [setPage, pagination.page]);

  const getPaginationInfo = useCallback(() => {
    const startItem = (pagination.page - 1) * pagination.pageSize + 1;
    const endItem = Math.min(pagination.page * pagination.pageSize, pagination.total);

    return {
      currentPage: pagination.page,
      totalPages: pagination.totalPages,
      pageSize: pagination.pageSize,
      totalItems: pagination.total,
      startItem,
      endItem,
      hasNextPage: pagination.page < pagination.totalPages,
      hasPrevPage: pagination.page > 1
    };
  }, [pagination]);

  return {
    // Estado
    page: pagination.page,
    pageSize: pagination.pageSize,
    total: pagination.total,
    totalPages: pagination.totalPages,

    // Funciones
    setPage,
    setPageSize,
    setTotal,
    goToFirstPage,
    goToLastPage,
    goToNextPage,
    goToPrevPage,

    // Información
    paginationInfo: getPaginationInfo(),

    // Helpers
    isFirstPage: pagination.page === 1,
    isLastPage: pagination.page === pagination.totalPages,
    hasData: pagination.total > 0
  };
}

/**
 * Hook personalizado para ordenamiento de tablas
 * @param {Object} options - Opciones de ordenamiento
 * @returns {Object} - Estado y funciones de ordenamiento
 */
export function useTableSorting(options = {}) {
  const [sorting, setSorting] = useState({
    sortBy: options.initialSortBy || null,
    sortOrder: options.initialSortOrder || 'asc' // 'asc' | 'desc'
  });

  const toggleSort = useCallback((column) => {
    setSorting(prev => {
      if (prev.sortBy === column) {
        // Cambiar dirección si es la misma columna
        return {
          sortBy: column,
          sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc'
        };
      } else {
        // Nueva columna, orden ascendente por defecto
        return {
          sortBy: column,
          sortOrder: 'asc'
        };
      }
    });
  }, []);

  const setSortingConfig = useCallback((sortBy, sortOrder = 'asc') => {
    setSorting({ sortBy, sortOrder });
  }, []);

  const clearSorting = useCallback(() => {
    setSorting({ sortBy: null, sortOrder: 'asc' });
  }, []);


  const getSortDirection = useCallback((column) => {
    if (sorting.sortBy !== column) return null;
    return sorting.sortOrder;
  }, [sorting]);

  const getSortIndicator = useCallback((column) => {
    const direction = getSortDirection(column);
    if (!direction) return '';
    return direction === 'asc' ? '↑' : '↓';
  }, [getSortDirection]);

  return {
    // Estado
    sortBy: sorting.sortBy,
    sortOrder: sorting.sortOrder,

    // Funciones
    toggleSort,
    setSorting,
    clearSorting,

    // Helpers
    getSortDirection,
    getSortIndicator,
    isSorted: !!sorting.sortBy,
    isSortedBy: (column) => sorting.sortBy === column
  };
}