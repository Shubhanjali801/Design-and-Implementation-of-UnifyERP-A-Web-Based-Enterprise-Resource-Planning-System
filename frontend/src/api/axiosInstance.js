import axios from "axios"

// connect to backend via axios
const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api",
})

// Attach token to every request automatically
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle token expiry globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  }
)

export default axiosInstance