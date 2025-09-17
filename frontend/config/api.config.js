export const apiConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  endpoints: {
    auth: '/api/auth',
    events: '/api/events',
    sets: '/api/sets',
    gallery: '/api/gallery'
  },
  timeout: 10000,
  retries: 3
};