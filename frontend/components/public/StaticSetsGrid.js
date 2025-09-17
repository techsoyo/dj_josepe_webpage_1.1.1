'use client';

import React from 'react';
import EnhancedSoundCloudPlayer from './EnhancedSoundCloudPlayer';

// Datos estáticos de los 20 tracks de SoundCloud
// NOTA: Estas URLs pueden necesitar ser actualizadas con tracks reales de SoundCloud
const STATIC_TRACKS = [
  {
    id: 1,
    title: "#4 Jam Session House 35 min",
    url: "https://soundcloud.com/jose-miguel-serra/jam-session-house-4-35-min",
    embedUrl: "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/jose-miguel-serra/jam-session-house-4-35-min&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true",
    artwork: "https://i1.sndcdn.com/artworks-000203731318-3gn8o9-t500x500.jpg",
    fallbackUrl: "https://soundcloud.com/example/track1" // URL de respaldo
  },
  {
    id: 2,
    title: "#43 Jam Session DANCE",
    url: "https://soundcloud.com/jose-miguel-serra/43-jam-session-dance",
    embedUrl: "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/jose-miguel-serra/43-jam-session-dance&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true",
    artwork: "https://i1.sndcdn.com/artworks-y5dYpLKEpGIl-0-t500x500.jpg"
  },
  {
    id: 3,
    title: "#42 Jam Session Tech-House",
    url: "https://soundcloud.com/jose-miguel-serra/42-jam-session-tech-house",
    embedUrl: "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/jose-miguel-serra/42-jam-session-tech-house&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true",
    artwork: "https://i1.sndcdn.com/artworks-ZeHkCD4lZ5lQ-0-t500x500.jpg"
  },
  {
    id: 4,
    title: "#41 Jam Session Deep",
    url: "https://soundcloud.com/jose-miguel-serra/41-jam-session-deep",
    embedUrl: "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/jose-miguel-serra/41-jam-session-deep&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true",
    artwork: "https://i1.sndcdn.com/artworks-8cO3wgB7Rq6h-0-t500x500.jpg"
  },
  {
    id: 5,
    title: "#40 Jam Session Disco",
    url: "https://soundcloud.com/jose-miguel-serra/40-jam-session-disco",
    embedUrl: "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/jose-miguel-serra/40-jam-session-disco&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true",
    artwork: "https://i1.sndcdn.com/artworks-7Kj9nH2lP3qs-0-t500x500.jpg"
  },
  {
    id: 6,
    title: "#39 Jam Session Afro",
    url: "https://soundcloud.com/jose-miguel-serra/39-jam-session-afro",
    embedUrl: "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/jose-miguel-serra/39-jam-session-afro&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true",
    artwork: "https://i1.sndcdn.com/artworks-9LmX0kM4nR8z-0-t500x500.jpg"
  },
  {
    id: 7,
    title: "#38 Jam Session Latin",
    url: "https://soundcloud.com/jose-miguel-serra/38-jam-session-latin",
    embedUrl: "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/jose-miguel-serra/38-jam-session-latin&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true",
    artwork: "https://i1.sndcdn.com/artworks-3FqV7wH5tY1a-0-t500x500.jpg"
  },
  {
    id: 8,
    title: "#37 Jam Session Techno",
    url: "https://soundcloud.com/jose-miguel-serra/37-jam-session-techno",
    embedUrl: "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/jose-miguel-serra/37-jam-session-techno&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true",
    artwork: "https://i1.sndcdn.com/artworks-6RpK9nM1sZ2l-0-t500x500.jpg"
  },
  {
    id: 9,
    title: "#36 Jam Session Trance",
    url: "https://soundcloud.com/jose-miguel-serra/36-jam-session-trance",
    embedUrl: "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/jose-miguel-serra/36-jam-session-trance&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true",
    artwork: "https://i1.sndcdn.com/artworks-5YtF3hG8kL7b-0-t500x500.jpg"
  },
  {
    id: 10,
    title: "#35 Jam Session EDM",
    url: "https://soundcloud.com/jose-miguel-serra/35-jam-session-edm",
    embedUrl: "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/jose-miguel-serra/35-jam-session-edm&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true",
    artwork: "https://i1.sndcdn.com/artworks-2QpR4jN7mC5x-0-t500x500.jpg"
  },
  {
    id: 11,
    title: "#33 Jam Session DnB",
    url: "https://soundcloud.com/jose-miguel-serra/33-jam-session-dnb",
    embedUrl: "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/jose-miguel-serra/33-jam-session-dnb&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true",
    artwork: "https://i1.sndcdn.com/artworks-4KnQ7wL2sR9p-0-t500x500.jpg"
  },
  {
    id: 12,
    title: "#34 Jam Session Breaks",
    url: "https://soundcloud.com/jose-miguel-serra/34-jam-session-breaks",
    embedUrl: "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/jose-miguel-serra/34-jam-session-breaks&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true",
    artwork: "https://i1.sndcdn.com/artworks-8XsT1kP9hG6m-0-t500x500.jpg"
  },
  {
    id: 13,
    title: "#32 Jam Session Hardcore",
    url: "https://soundcloud.com/jose-miguel-serra/32-jam-session-hardcore",
    embedUrl: "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/jose-miguel-serra/32-jam-session-hardcore&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true",
    artwork: "https://i1.sndcdn.com/artworks-7VmB9nH3tK8s-0-t500x500.jpg"
  },
  {
    id: 14,
    title: "#31 Jam Session Garage",
    url: "https://soundcloud.com/jose-miguel-serra/31-jam-session-garage",
    embedUrl: "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/jose-miguel-serra/31-jam-session-garage&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true",
    artwork: "https://i1.sndcdn.com/artworks-5YsF2hM6kL9b-0-t500x500.jpg"
  },
  {
    id: 15,
    title: "#30 Jam Session Bass",
    url: "https://soundcloud.com/jose-miguel-serra/30-jam-session-bass",
    embedUrl: "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/jose-miguel-serra/30-jam-session-bass&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true",
    artwork: "https://i1.sndcdn.com/artworks-9QnX4kP7hG3m-0-t500x500.jpg"
  },
  {
    id: 16,
    title: "#29 Jam Session Minimal",
    url: "https://soundcloud.com/jose-miguel-serra/29-jam-session-minimal",
    embedUrl: "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/jose-miguel-serra/29-jam-session-minimal&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true",
    artwork: "https://i1.sndcdn.com/artworks-2WpR7jN4mC5x-0-t500x500.jpg"
  },
  {
    id: 17,
    title: "#28 Jam Session Progressive",
    url: "https://soundcloud.com/jose-miguel-serra/28-jam-session-progressive",
    embedUrl: "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/jose-miguel-serra/28-jam-session-progressive&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true",
    artwork: "https://i1.sndcdn.com/artworks-5YtF3hG8kL7b-0-t500x500.jpg"
  },
  {
    id: 18,
    title: "#27 Jam Session Electro",
    url: "https://soundcloud.com/jose-miguel-serra/27-jam-session-electro",
    embedUrl: "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/jose-miguel-serra/27-jam-session-electro&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true",
    artwork: "https://i1.sndcdn.com/artworks-8cO3wgB7Rq6h-0-t500x500.jpg"
  },
  {
    id: 19,
    title: "#26 Jam Session Funky",
    url: "https://soundcloud.com/jose-miguel-serra/26-jam-session-funky",
    embedUrl: "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/jose-miguel-serra/26-jam-session-funky&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true",
    artwork: "https://i1.sndcdn.com/artworks-4KnQ7wL2sR9p-0-t500x500.jpg"
  },
  {
    id: 20,
    title: "#25 Jam Session Soulful",
    url: "https://soundcloud.com/jose-miguel-serra/25-jam-session-soulful",
    embedUrl: "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/jose-miguel-serra/25-jam-session-soulful&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true",
    artwork: "https://i1.sndcdn.com/artworks-7VmB9nH3tK8s-0-t500x500.jpg"
  }
];

// Componente para cada track individual
const TrackCard = ({ track }) => {
  return (
    <div className="track-card">
      <a href={track.url} target="_blank" rel="noopener noreferrer" className="track-link">
        <img
          src={track.artwork}
          alt={`Cover de ${track.title}`}
          className="track-artwork"
          loading="lazy"
          onError={(e) => {
            // Fallback para artwork que no carga
            e.target.src = 'https://via.placeholder.com/500x500/cccccc/666666?text=No+Artwork';
          }}
        />
      </a>
      <div className="track-content">
        <h4 className="track-title">{track.title}</h4>
        <EnhancedSoundCloudPlayer
          soundcloudUrl={track.url}
          fallbackUrl={track.fallbackUrl}
          title={track.title}
          artwork={track.artwork}
        />
      </div>
    </div>
  );
};

// Componente principal que renderiza la grilla de tracks estáticos
export default function StaticSetsGrid() {
  return (
    <div className="static-sets-grid">
      <style jsx>{`
        .static-sets-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          font-family: Arial, Helvetica, sans-serif;
        }

        .track-card {
          border: 1px solid #ddd;
          border-radius: 8px;
          overflow: hidden;
          background: #fff;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .track-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .track-link {
          display: block;
          text-decoration: none;
        }

        .track-artwork {
          width: 100%;
          height: auto;
          display: block;
          transition: opacity 0.2s ease;
        }

        .track-artwork:hover {
          opacity: 0.9;
        }

        .track-content {
          padding: 0.75rem;
        }

        .track-title {
          margin: 0 0 0.5rem;
          font-size: 1rem;
          color: #333;
          font-weight: 600;
        }

        /* Estilos responsivos */
        @media (max-width: 768px) {
          .static-sets-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          
          .track-content {
            padding: 0.5rem;
          }
          
          .track-title {
            font-size: 0.9rem;
          }
        }

        /* Estilos para tema oscuro (opcional) */
        @media (prefers-color-scheme: dark) {
          .track-card {
            border-color: #555;
            background: #2a2a2a;
          }
          
          .track-title {
            color: #fff;
          }
        }
      `}</style>
      
      {STATIC_TRACKS.map((track) => (
        <TrackCard key={track.id} track={track} />
      ))}
    </div>
  );
}