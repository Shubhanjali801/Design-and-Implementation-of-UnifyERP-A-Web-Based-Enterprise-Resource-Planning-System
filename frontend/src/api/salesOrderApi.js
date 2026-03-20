import axiosInstance from "./axiosInstance"
const BASE = import.meta.env.VITE_API_URL 

// sales-orders APIs connnect with backend endpoints
export const fetchSalesOrders  = (params)     => axiosInstance.get(`${BASE}/sales-orders`, { params })
export const fetchSalesOrder   = (id)         => axiosInstance.get(`${BASE}/sales-orders/${id}`)
export const createSalesOrder  = (data)       => axiosInstance.post(`${BASE}/sales-orders`, data)
export const updateSalesOrder  = (id, data)   => axiosInstance.put(`${BASE}/sales-orders/${id}`, data)
export const cancelSalesOrder  = (id)         => axiosInstance.delete(`${BASE}/sales-orders/${id}`)