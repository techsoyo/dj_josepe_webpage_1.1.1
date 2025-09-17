'use client';

import { useState, useEffect } from 'react';

const Calendar = ({ events = [], onDateSelect, onEventClick, className = '' }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewMode, setViewMode] = useState('month'); // 'month', 'week'

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    
    // Ajustar al domingo anterior si es necesario
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDay = new Date(startDate);
    
    // Generar 42 días (6 semanas)
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }
    
    return days;
  };

  const getEventsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => {
      const eventDate = new Date(event.date).toISOString().split('T')[0];
      return eventDate === dateStr;
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const isSelected = (date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    onDateSelect && onDateSelect(date);
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const navigateToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
    onDateSelect && onDateSelect(today);
  };

  const renderMonthView = () => {
    const days = getDaysInMonth(currentDate);
    
    return (
      <div className="calendar-grid">
        {/* Header de días */}
        <div className="calendar-header row g-0">
          {dayNames.map((day) => (
            <div key={day} className="col text-center py-2 fw-bold text-warning border-bottom border-secondary">
              {day}
            </div>
          ))}
        </div>
        
        {/* Grid de días */}
        <div className="calendar-body">
          {Array.from({ length: 6 }).map((_, weekIndex) => (
            <div key={weekIndex} className="row g-0">
              {days.slice(weekIndex * 7, (weekIndex + 1) * 7).map((day, dayIndex) => {
                const dayEvents = getEventsForDate(day);
                
                return (
                  <div 
                    key={dayIndex} 
                    className={`col calendar-day p-1 border-end border-bottom border-secondary position-relative ${
                      !isCurrentMonth(day) ? 'text-muted' : ''
                    } ${
                      isToday(day) ? 'today' : ''
                    } ${
                      isSelected(day) ? 'selected' : ''
                    }`}
                    style={{ height: '100px', cursor: 'pointer' }}
                    onClick={() => handleDateClick(day)}
                  >
                    <div className="d-flex justify-content-between align-items-start h-100">
                      <span className={`day-number ${
                        isToday(day) ? 'fw-bold text-warning' : ''
                      }`}>
                        {day.getDate()}
                      </span>
                      
                      {dayEvents.length > 0 && (
                        <span className="badge bg-warning text-dark rounded-pill small">
                          {dayEvents.length}
                        </span>
                      )}
                    </div>
                    
                    {/* Eventos del día */}
                    <div className="day-events mt-1">
                      {dayEvents.slice(0, 2).map((event, eventIndex) => (
                        <div
                          key={eventIndex}
                          className="event-item bg-warning text-dark rounded px-1 mb-1 small text-truncate"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEventClick && onEventClick(event);
                          }}
                          title={event.title}
                          style={{ fontSize: '10px', cursor: 'pointer' }}
                        >
                          {event.title}
                        </div>
                      ))}
                      
                      {dayEvents.length > 2 && (
                        <div className="text-muted small" style={{ fontSize: '9px' }}>
                          +{dayEvents.length - 2} más
                        </div>
                      )}
                    </div>
                    
                    {/* Indicador de hoy */}
                    {isToday(day) && (
                      <div className="position-absolute top-0 start-0 w-100 h-100 border border-2 border-warning rounded pointer-events-none"></div>
                    )}
                    
                    {/* Indicador de selección */}
                    {isSelected(day) && (
                      <div className="position-absolute top-0 start-0 w-100 h-100 bg-warning bg-opacity-25 pointer-events-none"></div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`calendar-component ${className}`}>
      {/* Header del calendario */}
      <div className="calendar-controls d-flex justify-content-between align-items-center mb-3 p-3 bg-dark border border-secondary rounded">
        <div className="d-flex align-items-center gap-2">
          <button
            className="btn btn-outline-warning btn-sm"
            onClick={() => navigateMonth(-1)}
          >
            <i className="bi bi-chevron-left"></i>
          </button>
          
          <h5 className="mb-0 text-warning mx-3">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h5>
          
          <button
            className="btn btn-outline-warning btn-sm"
            onClick={() => navigateMonth(1)}
          >
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
        
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-info btn-sm"
            onClick={navigateToToday}
          >
            <i className="bi bi-calendar-check me-1"></i>
            Hoy
          </button>
          
          <div className="btn-group" role="group">
            <button
              className={`btn btn-sm ${
                viewMode === 'month' ? 'btn-warning' : 'btn-outline-warning'
              }`}
              onClick={() => setViewMode('month')}
            >
              Mes
            </button>
            <button
              className={`btn btn-sm ${
                viewMode === 'week' ? 'btn-warning' : 'btn-outline-warning'
              }`}
              onClick={() => setViewMode('week')}
              disabled
            >
              Semana
            </button>
          </div>
        </div>
      </div>

      {/* Cuerpo del calendario */}
      <div className="calendar-container bg-dark border border-secondary rounded overflow-hidden">
        {viewMode === 'month' && renderMonthView()}
      </div>
      
      {/* Información adicional */}
      {selectedDate && (
        <div className="selected-date-info mt-3 p-3 bg-dark border border-secondary rounded">
          <h6 className="text-warning mb-2">
            <i className="bi bi-calendar-date me-2"></i>
            {selectedDate.toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </h6>
          
          {getEventsForDate(selectedDate).length > 0 ? (
            <div>
              <small className="text-muted d-block mb-2">
                Eventos del día:
              </small>
              {getEventsForDate(selectedDate).map((event, index) => (
                <div 
                  key={index} 
                  className="event-detail d-flex align-items-center mb-1 p-2 bg-warning bg-opacity-10 rounded cursor-pointer"
                  onClick={() => onEventClick && onEventClick(event)}
                >
                  <i className="bi bi-dot text-warning fs-3 me-2"></i>
                  <div>
                    <div className="fw-bold text-light">{event.title}</div>
                    {event.time && (
                      <small className="text-muted">{event.time}</small>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <small className="text-muted">No hay eventos programados para este día.</small>
          )}
        </div>
      )}
      
      <style jsx>{`
        .calendar-day {
          transition: all 0.2s ease;
        }
        
        .calendar-day:hover {
          background-color: rgba(255, 193, 7, 0.1);
        }
        
        .event-item {
          transition: all 0.2s ease;
        }
        
        .event-item:hover {
          background-color: #ffd43b !important;
          transform: scale(1.02);
        }
        
        .event-detail {
          transition: all 0.2s ease;
        }
        
        .event-detail:hover {
          background-color: rgba(255, 193, 7, 0.2) !important;
          transform: translateX(5px);
        }
        
        .cursor-pointer {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default Calendar;