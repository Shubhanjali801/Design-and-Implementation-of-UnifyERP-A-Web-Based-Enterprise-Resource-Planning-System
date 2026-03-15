import axiosInstance from "./axiosInstance"

// sales-orders APIs connnect with backend endpoints
export const fetchSalesOrders  = (params)     => axiosInstance.get("/sales-orders", { params })
export const fetchSalesOrder   = (id)         => axiosInstance.get(`/sales-orders/${id}`)
export const createSalesOrder  = (data)       => axiosInstance.post("/sales-orders", data)
export const updateSalesOrder  = (id, data)   => axiosInstance.put(`/sales-orders/${id}`, data)
export const cancelSalesOrder  = (id)         => axiosInstance.delete(`/sales-orders/${id}`)