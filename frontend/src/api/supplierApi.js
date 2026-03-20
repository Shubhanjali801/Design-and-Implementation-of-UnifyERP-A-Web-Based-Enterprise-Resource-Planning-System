import axiosInstance from "./axiosInstance"
const BASE = import.meta.env.VITE_API_URL

// suppliers APIs connnect with backend endpoints
export const fetchSuppliers = (params)     => axiosInstance.get(`${BASE}/suppliers`, { params })
export const fetchSupplier  = (id)         => axiosInstance.get(`${BASE}/suppliers/${id}`)
export const createSupplier = (data)       => axiosInstance.post(`${BASE}/suppliers`, data)
export const updateSupplier = (id, data)   => axiosInstance.put(`${BASE}/suppliers/${id}`, data)
export const deleteSupplier = (id)         => axiosInstance.delete(`${BASE}/suppliers/${id}`)