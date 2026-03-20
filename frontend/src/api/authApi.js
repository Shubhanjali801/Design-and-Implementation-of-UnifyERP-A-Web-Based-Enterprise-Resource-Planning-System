import axiosInstance from "./axiosInstance"

const BASE = import.meta.env.VITE_API_URL  

// ── Auth API calls ─────────────────────────────────────────────

export const loginApi    = (data)     => axiosInstance.post(`${BASE}/auth/login`, data)
export const registerApi = (data)     => axiosInstance.post(`${BASE}/auth/register`, data)
export const logoutApi   = ()         => axiosInstance.post(`${BASE}/auth/logout`)
export const getMeApi    = ()         => axiosInstance.get(`${BASE}/auth/me`)

// ── Admin User Management ──────────────────────────────────────

export const fetchUsers  = (params)   => axiosInstance.get(`${BASE}/auth/users`, { params })
export const fetchUser   = (id)       => axiosInstance.get(`${BASE}/auth/users/${id}`)
export const updateUser  = (id, data) => axiosInstance.put(`${BASE}/auth/users/${id}`, data)
export const deleteUser  = (id)       => axiosInstance.delete(`${BASE}/auth/users/${id}`)