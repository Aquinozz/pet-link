import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor de REQUEST: anexa o JWT em toda requisição
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('petlink_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('petlink_token')
    }
    return Promise.reject(error)
  }
)

export default api
