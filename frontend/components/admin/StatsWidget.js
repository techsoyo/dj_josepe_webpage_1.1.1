'use client';

import { useState, useEffect } from 'react';

const StatsWidget = ({ 
  title, 
  value, 
  icon, 
  color = 'warning', 
  change, 
  trend = 'up',
  loading = false,
  onClick,
  className = '',
  size = 'md', // 'sm', 'md', 'lg'
  animate = true,
  highlight = false
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animación de entrada
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!animate || loading) {
      setDisplayValue(value);
      return;
    }

    // Animar el valor numérico
    const numericValue = typeof value === 'string' 
      ? parseFloat(value.replace(/[^0-9.-]+/g, '')) || 0
      : value || 0;
    
    let start = 0;
    const duration = 1000; // 1 segundo
    const increment = numericValue / (duration / 16); // 60fps
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= numericValue) {
        setDisplayValue(numericValue);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, animate, loading]);

  const formatDisplayValue = (val) => {
    if (typeof value === 'string' && value.includes('k')) {
      return `${(val / 1000).toFixed(1)}k`;
    }
    if (typeof value === 'string' && value.includes('%')) {
      return `${val}%`;
    }
    return val.toLocaleString();
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          card: 'p-3',
          icon: 'fs-4',
          value: 'h4',
          title: 'small'
        };
      case 'lg':
        return {
          card: 'p-4',
          icon: 'fs-1',
          value: 'h1',
          title: 'h6'
        };
      default:
        return {
          card: 'p-3',
          icon: 'fs-3',
          value: 'h3',
          title: 'h6'
        };
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return 'bi-arrow-up text-success';
      case 'down':
        return 'bi-arrow-down text-danger';
      case 'neutral':
        return 'bi-arrow-right text-warning';
      default:
        return 'bi-arrow-up text-success';
    }
  };

  const sizeClasses = getSizeClasses();

  return (
    <div 
      className={`stats-widget card bg-dark h-100 ${
        highlight ? `border-${color}` : 'border-secondary'
      } ${onClick ? 'cursor-pointer' : ''} ${className} ${
        isVisible ? 'widget-visible' : 'widget-hidden'
      }`}
      onClick={onClick}
      style={{
        transition: 'all 0.3s ease',
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        opacity: isVisible ? 1 : 0
      }}
    >
      <div className={`card-body ${sizeClasses.card} d-flex align-items-center`}>
        {loading ? (
          <div className="w-100 text-center">
            <div className="spinner-border text-warning" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <div className="mt-2 text-muted small">Cargando...</div>
          </div>
        ) : (
          <>
            {/* Icon */}
            <div className="widget-icon me-3">
              <i className={`${icon} text-${color} ${sizeClasses.icon}`}></i>
            </div>
            
            {/* Content */}
            <div className="widget-content flex-grow-1">
              <div className="d-flex align-items-center justify-content-between mb-1">
                <h6 className={`${sizeClasses.title} text-muted mb-0 text-uppercase fw-bold`}>
                  {title}
                </h6>
                
                {highlight && (
                  <span className="badge bg-warning text-dark pulse">
                    <i className="bi bi-exclamation-circle"></i>
                  </span>
                )}
              </div>
              
              <div className={`${sizeClasses.value} mb-1 text-light fw-bold widget-value`}>
                {animate && typeof value === 'number' 
                  ? formatDisplayValue(displayValue)
                  : value
                }
              </div>
              
              {change && (
                <div className="widget-change d-flex align-items-center">
                  <i className={`${getTrendIcon()} me-1 small`}></i>
                  <small className={`${
                    trend === 'up' ? 'text-success' :
                    trend === 'down' ? 'text-danger' :
                    'text-warning'
                  } fw-bold`}>
                    {change}
                  </small>
                </div>
              )}
            </div>
          </>
        )}
      </div>
      
      {/* Progress indicator (optional) */}
      {highlight && (
        <div className="position-absolute bottom-0 start-0 w-100">
          <div className="progress" style={{ height: '3px' }}>
            <div 
              className={`progress-bar bg-${color}`}
              role="progressbar"
              style={{ width: '100%' }}
            ></div>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .stats-widget {
          border-width: 2px !important;
          position: relative;
          overflow: hidden;
        }
        
        .stats-widget:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        }
        
        .stats-widget.cursor-pointer:hover {
          border-color: #ffc107 !important;
        }
        
        .widget-value {
          line-height: 1.2;
        }
        
        .widget-icon {
          opacity: 0.9;
        }
        
        .pulse {
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }
        
        .widget-hidden {
          transform: translateY(20px);
          opacity: 0;
        }
        
        .widget-visible {
          transform: translateY(0);
          opacity: 1;
        }
        
        .progress {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
};

export default StatsWidget;