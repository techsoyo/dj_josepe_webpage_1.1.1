'use client'
import { useState, useEffect } from 'react'
import { z } from 'zod'
import setsService from '../../../services/setsService'

// Zod schema for music set validation matching backend structure
const musicSetSchema = z.object({
  id: z.number(),
  title: z.string(),
  slug: z.string(),
  description: z.string().nullable().optional(),
  genre: z.string().nullable().optional(),
  subgenre: z.string().nullable().optional(),
  bpm: z.string().nullable().optional(),
  duration: z.string().nullable().optional(),
  releaseDate: z.string().nullable().optional(),
  recordedAt: z.string().nullable().optional(),
  mood: z.string().nullable().optional(),
  tags: z.string().nullable().optional(),
  soundcloudUrl: z.string().nullable().optional(),
  mixcloudUrl: z.string().nullable().optional(),
  youtubeUrl: z.string().nullable().optional(),
  spotifyUrl: z.string().nullable().optional(),
  beatportUrl: z.string().nullable().optional(),
  downloadUrl: z.string().nullable().optional(),
  featured: z.number().optional(),
  exclusive: z.number().optional(),
  liveRecording: z.number().optional(),
  quality: z.string().optional(),
  seo_title: z.string().nullable().optional(),
  seo_description: z.string().nullable().optional(),
  published: z.number().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  coverPhotoId: z.number().nullable().optional()
})

export default function SetsPage() {
  const [sets, setSets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    genre: '',
    search: '',
    page: 1,
    limit: 10
  })

  useEffect(() => {
    loadSets()
  }, [filters])

  const loadSets = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = {
        page: filters.page,
        limit: filters.limit,
        ...(filters.genre && { genre: filters.genre }),
        ...(filters.search && { q: filters.search })
      }

      const response = await setsService.getSets(params)

      // Validate response data - handle both formats (response.data or direct response)
      let setsData = []
      if (response.data && Array.isArray(response.data)) {
        setsData = response.data
      } else if (Array.isArray(response)) {
        setsData = response
      } else {
        console.warn('Unexpected response format:', response)
        setsData = []
      }

      // Validate each set individually to provide better error handling
      const validatedSets = setsData.map((set, index) => {
        try {
          return musicSetSchema.parse(set);
        } catch (validationError) {
          console.warn(`Validation failed for set at index ${index}:`, set);
          console.warn('Validation error:', validationError.errors);
          // Return a minimal valid set structure
          return {
            id: set.id || index,
            title: set.title || 'Set sin título',
            description: set.description || '',
            genre: set.genre || '',
            releaseDate: set.releaseDate || '',
            duration: undefined,
            coverPhoto: set.coverPhoto || undefined,
            tracks: set.tracks || []
          };
        }
      })
      setSets(validatedSets)

    } catch (err) {
      console.error('Error loading sets:', err)
      setError('Error al cargar los sets musicales')
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset page when filters change
    }))
  }

  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Cargando sets...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-400 text-xl">{error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Sets Musicales
        </h1>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-4 justify-center">
          <input
            type="text"
            placeholder="Buscar sets..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500"
          />

          <select
            value={filters.genre}
            onChange={(e) => handleFilterChange('genre', e.target.value)}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500"
          >
            <option value="">Todos los géneros</option>
            <option value="house">House</option>
            <option value="techno">Techno</option>
            <option value="progressive">Progressive</option>
            <option value="trance">Trance</option>
            <option value="deep">Deep House</option>
            <option value="minimal">Minimal</option>
          </select>
        </div>

        {/* Sets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sets.map((set) => (
            <div key={set.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              {set.coverPhoto?.url && (
                <img
                  src={set.coverPhoto.url}
                  alt={set.coverPhoto.alt || set.title}
                  className="w-full h-48 object-cover"
                />
              )}

              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {set.title}
                </h3>

                {set.description && (
                  <p className="text-gray-300 mb-4 line-clamp-3">
                    {set.description}
                  </p>
                )}

                <div className="flex justify-between items-center text-sm text-gray-400 mb-4">
                  {set.genre && (
                    <span className="bg-blue-600 text-white px-2 py-1 rounded">
                      {set.genre}
                    </span>
                  )}

                  {set.duration && (
                    <span>{Math.floor(set.duration / 60)}:{(set.duration % 60).toString().padStart(2, '0')}</span>
                  )}
                </div>

                {set.tracks && set.tracks.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">
                      Tracks ({set.tracks.length})
                    </h4>
                    <div className="space-y-1">
                      {set.tracks.slice(0, 3).map((track) => (
                        <div key={track.id} className="text-xs text-gray-400 flex justify-between">
                          <span>{track.title}</span>
                          {track.artist && <span>{track.artist}</span>}
                        </div>
                      ))}
                      {set.tracks.length > 3 && (
                        <div className="text-xs text-gray-500">
                          +{set.tracks.length - 3} más...
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors">
                  Reproducir Set
                </button>
              </div>
            </div>
          ))}
        </div>

        {sets.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            No se encontraron sets musicales
          </div>
        )}

        {/* Pagination would go here */}
        <div className="flex justify-center mt-8">
          <button
            onClick={() => handlePageChange(filters.page - 1)}
            disabled={filters.page <= 1}
            className="px-4 py-2 bg-gray-800 text-white rounded-l-lg border border-gray-700 disabled:opacity-50"
          >
            Anterior
          </button>

          <span className="px-4 py-2 bg-gray-700 text-white border-t border-b border-gray-700">
            Página {filters.page}
          </span>

          <button
            onClick={() => handlePageChange(filters.page + 1)}
            disabled={sets.length < filters.limit}
            className="px-4 py-2 bg-gray-800 text-white rounded-r-lg border border-gray-700 disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  )
}