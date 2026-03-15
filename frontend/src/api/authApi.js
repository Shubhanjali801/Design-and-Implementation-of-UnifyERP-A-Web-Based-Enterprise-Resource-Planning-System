import axiosInstance from "./axiosInstance"

// ── Auth API calls ─────────────────────────────────────────────

export const loginApi    = (data)       => axiosInstance.post("/auth/login", data)
export const registerApi = (data)       => axiosInstance.post("/auth/register", data)
export const logoutApi   = ()           => axiosInstance.post("/auth/logout")
export const getMeApi    = ()           => axiosInstance.get("/auth/me")

// ── Admin User Management ──────────────────────────────────────

export const fetchUsers  = (params)     => axiosInstance.get("/auth/users", { params })
export const fetchUser   = (id)         => axiosInstance.get(`/auth/users/${id}`)
export const updateUser  = (id, data)   => axiosInstance.put(`/auth/users/${id}`, data)
export const deleteUser  = (id)         => axiosInstance.delete(`/auth/users/${id}`)