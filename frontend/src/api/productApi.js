import axiosInstance from "./axiosInstance"
const BASE = import.meta.env.VITE_API_URL 

// products APIs connnect with backend endpoints
export const fetchProducts    = (params) => axiosInstance.get(`${BASE}/products`, { params })
export const fetchProduct     = (id)     => axiosInstance.get(`${BASE}/products/${id}`)
export const createProduct    = (data)   => axiosInstance.post(`${BASE}/products`, data)
export const updateProduct    = (id, data) => axiosInstance.put(`${BASE}/products/${id}`, data)
export const deleteProduct    = (id)     => axiosInstance.delete(`${BASE}/products/${id}`)
export const fetchLowStock    = ()       => axiosInstance.get(`${BASE}/products/low-stock`)