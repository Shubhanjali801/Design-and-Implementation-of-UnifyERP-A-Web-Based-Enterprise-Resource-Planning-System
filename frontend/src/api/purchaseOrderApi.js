import axiosInstance from "./axiosInstance"
const BASE = import.meta.env.VITE_API_URL  

// purchase-orders APIs connnect with backend endpoints
export const fetchPurchaseOrders = (params)   => axiosInstance.get(`${BASE}/purchase-orders`, { params })
export const fetchPurchaseOrder  = (id)       => axiosInstance.get(`${BASE}/purchase-orders/${id}`)
export const createPurchaseOrder = (data)     => axiosInstance.post(`${BASE}/purchase-orders`, data)
export const updatePurchaseOrder = (id, data) => axiosInstance.put(`${BASE}/purchase-orders/${id}`, data)
export const cancelPurchaseOrder = (id)       => axiosInstance.delete(`${BASE}/purchase-orders/${id}`)