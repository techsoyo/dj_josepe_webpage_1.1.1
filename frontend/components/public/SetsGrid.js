// frontend/components/public/SetsGrid.js
'use client';

import React from 'react';

export default function SetsGrid({ sets }) {
  if (!sets || sets.length === 0) {
    return (
      <p className="text-center text-gray-500">
        No hay sets disponibles en este momento.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {sets.map((set) => {
        const cover = set.coverImage ?? null;

        return (
          <div
            key={set.id}
            className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-100"
          >
            {cover && (
              <img
                src={cover}
                alt={set.title || 'Set'}
                className="w-full h-44 object-cover"
                loading="lazy"
              />
            )}

            <div className="p-3">
              <h3 className="text-xl font-semibold mb-1">
                {set.title || 'Untitled Set'}
              </h3>

              {set.description && (
                <p className="text-gray-700 mb-3">{set.description}</p>
              )}

              {set.soundcloudUrl ? (
                <div 
                  className="player-wrapper mb-2"
                  style={{ position: 'relative', marginBottom: '13px' }}
                >
                  <iframe
                    width="100%"
                    height="85"
                    scrolling="no"
                    frameBorder="no"
                    allow="autoplay"
                    title={`SoundCloud player for ${set.title}`}
                    src={
                      set.soundcloudUrl.includes('w.soundcloud.com/player/')
                        ? set.soundcloudUrl
                        : `https://w.soundcloud.com/player/?url=${encodeURIComponent(
                            set.soundcloudUrl
                          )}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true`
                    }
                    style={{ borderRadius: '8px', marginBottom: '4px' }}
                    onError={(e) => {
                      // Hide the iframe if it fails to load
                      e.target.style.display = 'none';
                      // Show a fallback message
                      const fallback = document.createElement('div');
                      fallback.className = 'text-center text-gray-500 py-7';
                      fallback.innerHTML = `
                        <i class="fas fa-music fa-2x mb-2"></i>
                        <p>Reproductor no disponible</p>
                        <a href="${set.soundcloudUrl}" target="_blank" class="text-blue-500 hover:underline">
                          Escuchar en SoundCloud
                        </a>
                      `;
                      e.target.parentNode.appendChild(fallback);
                    }}
                  ></iframe>
                  
                  {/* Atribución de SoundCloud (similar al ejemplo que proporcionaste) */}
                  <div style={{
                    fontSize: '10px',
                    color: '#cccccc',
                    lineBreak: 'anywhere',
                    wordBreak: 'normal',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    fontFamily: 'Interstate, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Garuda, Verdana, Tahoma, sans-serif',
                    fontWeight: 100
                  }}>
                    <a 
                      href="https://soundcloud.com/jose-miguel-serra" 
                      title="Jose Miguel Serra (official)" 
                      target="_blank" 
                      style={{ color: '#cccccc', textDecoration: 'none' }}
                    >
                      Jose Miguel Serra (official)
                    </a>
                    {set.title && (
                      <>
                        {' · '}
                        <a 
                          href={set.soundcloudUrl} 
                          title={set.title} 
                          target="_blank" 
                          style={{ color: '#cccccc', textDecoration: 'none' }}
                        >
                          {set.title}
                        </a>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-400">
                  No hay URL de SoundCloud para este set.
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}