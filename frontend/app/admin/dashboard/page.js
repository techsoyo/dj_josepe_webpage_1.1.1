'use client'
import { useState, useEffect } from 'react'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import authService from '../../../services/authService'
import setsService from '../../../services/setsService'
import contactService from '../../../services/ContactService'

// Zod schemas for validation
const dashboardStatsSchema = z.object({
  totalSets: z.number(),
  totalMessages: z.number(),
  recentActivity: z.array(z.object({
    id: z.number(),
    type: z.string(),
    message: z.string(),
    timestamp: z.string()
  }))
})

export default function AdminDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalSets: 0,
    totalMessages: 0,
    recentActivity: []
  })
  const [recentSets, setRecentSets] = useState([])
  const [recentMessages, setRecentMessages] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    checkAuthAndLoadData()
  }, [])

  const checkAuthAndLoadData = async () => {
    try {
      // Check if user is authenticated
      const isAuthenticated = await authService.checkAuth()
      if (!isAuthenticated) {
        router.push('/admin/login')
        return
      }

      await loadDashboardData()
    } catch (err) {
      console.error('Auth check failed:', err)
      router.push('/admin/login')
    }
  }

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Load dashboard data in parallel
      const [setsResponse, messagesResponse] = await Promise.all([
        setsService.getSets({ limit: 5, sort: 'createdAt', order: 'desc' }),
        contactService.getContactMessages({ limit: 5, sort: 'newest' })
      ])

      // Extract data from responses
      const sets = setsResponse.data || []
      const messages = messagesResponse.messages || []

      setRecentSets(sets)
      setRecentMessages(messages)

      // Calculate stats
      const dashboardStats = {
        totalSets: setsResponse.pagination?.total || sets.length,
        totalMessages: messagesResponse.pagination?.totalCount || messages.length,
        recentActivity: [
          ...sets.slice(0, 3).map(set => ({
            id: set.id,
            type: 'set',
            message: `Nuevo set: ${set.title}`,
            timestamp: set.createdAt || new Date().toISOString()
          })),
          ...messages.slice(0, 3).map(msg => ({
            id: msg.id,
            type: 'message',
            message: `Mensaje de ${msg.name}: ${msg.subject || 'Sin asunto'}`,
            timestamp: msg.createdAt || new Date().toISOString()
          }))
        ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5)
      }

      // Validate with Zod
      const validatedStats = dashboardStatsSchema.parse(dashboardStats)
      setStats(validatedStats)

    } catch (err) {
      console.error('Error loading dashboard data:', err)
      setError('Error al cargar los datos del dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await authService.logout()
      router.push('/admin/login')
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  const markMessageAsRead = async (messageId) => {
    try {
      await contactService.updateContactMessage(messageId, { read: true })
      // Refresh messages
      await loadDashboardData()
    } catch (err) {
      console.error('Error marking message as read:', err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Cargando dashboard...</div>
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
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-white">
              Panel de Administración
            </h1>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-600 bg-opacity-75">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total Sets</p>
                <p className="text-2xl font-semibold text-white">{stats.totalSets}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-600 bg-opacity-75">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Mensajes</p>
                <p className="text-2xl font-semibold text-white">{stats.totalMessages}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-600 bg-opacity-75">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Actividad Reciente</p>
                <p className="text-2xl font-semibold text-white">{stats.recentActivity.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Sets */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Sets Recientes</h2>
            <div className="space-y-4">
              {recentSets.length > 0 ? (
                recentSets.map((set) => (
                  <div key={set.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div>
                      <h3 className="font-medium text-white">{set.title}</h3>
                      <p className="text-sm text-gray-400">{set.genre || 'Sin género'}</p>
                    </div>
                    <div className="text-sm text-gray-400">
                      {new Date(set.createdAt || Date.now()).toLocaleDateString()}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No hay sets recientes</p>
              )}
            </div>
          </div>

          {/* Recent Messages */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Mensajes Recientes</h2>
            <div className="space-y-4">
              {recentMessages.length > 0 ? (
                recentMessages.map((message) => (
                  <div key={message.id} className="flex items-start justify-between p-3 bg-gray-700 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-white">{message.name}</h3>
                        {!message.read && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400">{message.email}</p>
                      <p className="text-sm text-gray-300 mt-1">
                        {message.subject || 'Sin asunto'}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-sm text-gray-400">
                        {new Date(message.createdAt || Date.now()).toLocaleDateString()}
                      </div>
                      {!message.read && (
                        <button
                          onClick={() => markMessageAsRead(message.id)}
                          className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded"
                        >
                          Marcar leído
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No hay mensajes recientes</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Actividad Reciente</h2>
          <div className="space-y-3">
            {stats.recentActivity.length > 0 ? (
              stats.recentActivity.map((activity) => (
                <div key={`${activity.type}-${activity.id}`} className="flex items-center p-3 bg-gray-700 rounded-lg">
                  <div className={`p-2 rounded-full ${activity.type === 'set' ? 'bg-blue-600' : 'bg-green-600'
                    } bg-opacity-75 mr-3`}>
                    {activity.type === 'set' ? (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path>
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-white">{activity.message}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No hay actividad reciente</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}