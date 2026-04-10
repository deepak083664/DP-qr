export const BASE_URL = import.meta.env.MODE === 'development' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000'
  : ''; // Relative so it uses current domain and hits Vercel proxy
