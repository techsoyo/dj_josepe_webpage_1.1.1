"use client";

import { useEffect, useState } from 'react';
import EventList from '../../../components/public/EventList';
import Link from 'next/link';
import eventsService from '../../../services/eventsService.js';

export default function EventsPage() {
  const [events, setEvents] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Animación de entrada
    const eventsContainer = document.querySelector('.events-container');
    if (eventsContainer) {
      eventsContainer.style.transform = 'translateX(100%)';
      eventsContainer.style.opacity = '0';
      setTimeout(() => {
        eventsContainer.style.transform = 'translateX(0)';
        eventsContainer.style.opacity = '1';
        eventsContainer.classList.add('slide-in');
      }, 100);
    }

    // Llamada al backend para obtener eventos próximos
    async function fetchEvents() {
      try {
        const response = await eventsService.getUpcomingEvents(10);
        const data = response?.data || response;
        setEvents(data || []);
      } catch (err) {
        console.error('Error loading events:', err);
        const message = err?.response?.data?.message || err?.message || 'Error al obtener los eventos';
        setError(message);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  return (
    <div className="events-page">
      {/* sección hero, contenido principal, estadísticas y estilos */}
      <section
        className="events-container section bg-light text-dark"
        style={{
          transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          overflow: 'hidden'
        }}
      >
        <div className="container">
          <div className="events-list-container">
            {loading && <p className="text-center">Cargando eventos...</p>}
            {error && !loading && <p className="text-center text-danger">{error}</p>}
            {!loading && !error && <EventList events={events} />}
          </div>
          {/* Resto del contenido */}
        </div>
      </section>
    </div>
  );
}
