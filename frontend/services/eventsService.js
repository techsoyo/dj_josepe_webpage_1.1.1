// services/eventsService.js
//
// Provides functions for working with events on the backend.  This
// includes standard CRUD operations as well as retrieving calendar
// events for a given month and year.

import api from './api';

const eventsService = {
  /**
   * Fetch a list of events.  Accepts optional query parameters for
   * filtering and pagination.  Returns whatever structure the backend
   * provides (array or object).
   */
  async getEvents(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return await api.get(`/api/events${qs ? `?${qs}` : ''}`);
  },

  /**
   * Retrieve all events including unpublished ones (for admin)
   */
  async getAllEvents(includeUnpublished = false) {
    try {
      const endpoint = includeUnpublished ? '/api/events/admin' : '/api/events';
      const response = await api.get(endpoint);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw new Error('Error al obtener los eventos');
    }
  },

  /** Retrieve a single event by id. */
  async getEvent(id) {
    try {
      const response = await api.get(`/api/events/${id}`);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching event:', error);
      throw new Error('Error al obtener el evento');
    }
  },

  /** Create a new event. */
  async createEvent(data) {
    try {
      const response = await api.post('/api/events', data);
      return response.data || response;
    } catch (error) {
      console.error('Error creating event:', error);
      const message = error.response?.data?.message || 'Error al crear el evento';
      throw new Error(message);
    }
  },

  /** Update an existing event. */
  async updateEvent(id, data) {
    try {
      const response = await api.put(`/api/events/${id}`, data);
      return response.data || response;
    } catch (error) {
      console.error('Error updating event:', error);
      const message = error.response?.data?.message || 'Error al actualizar el evento';
      throw new Error(message);
    }
  },

  /** Delete an event by id. */
  async deleteEvent(id) {
    try {
      await api.delete(`/api/events/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting event:', error);
      const message = error.response?.data?.message || 'Error al eliminar el evento';
      throw new Error(message);
    }
  },

  /** Toggle published status of an event */
  async togglePublished(id, published) {
    try {
      const response = await api.patch(`/api/events/${id}/publish`, { published });
      return response.data || response;
    } catch (error) {
      console.error('Error toggling published status:', error);
      throw new Error('Error al cambiar el estado de publicación');
    }
  },

  /**
   * Fetch events in a calendar format.  Provide month (1–12) and
   * year (full year) to retrieve events for that period.
   */
  async getCalendarEvents(month, year) {
    return await api.get(`/events/calendar?month=${month}&year=${year}`);
  },

  // Método para obtener eventos próximos
  async getUpcomingEvents(limit = 10) {
    try {
      // Usar la ruta existente y filtrar eventos próximos en el cliente
      const response = await api.get('/api/events/');
      const events = response.data || response;
      
      // Filtrar eventos que no han pasado aún y ordenar por fecha
      const now = new Date();
      const upcomingEvents = events
        .filter(event => {
          if (!event.date) return false;
          const eventDate = new Date(event.date);
          return eventDate >= now;
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, limit);
      
      return upcomingEvents;
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
      throw new Error('Error al obtener eventos próximos');
    }
  },
};

export default eventsService;