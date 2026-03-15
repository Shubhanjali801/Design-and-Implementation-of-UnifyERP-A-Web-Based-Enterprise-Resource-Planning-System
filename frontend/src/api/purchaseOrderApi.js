import axiosInstance from "./axiosInstance"

// purchase-orders APIs connnect with backend endpoints
export const fetchPurchaseOrders = (params)   => axiosInstance.get("/purchase-orders", { params })
export const fetchPurchaseOrder  = (id)       => axiosInstance.get(`/purchase-orders/${id}`)
export const createPurchaseOrder = (data)     => axiosInstance.post("/purchase-orders", data)
export const updatePurchaseOrder = (id, data) => axiosInstance.put(`/purchase-orders/${id}`, data)
export const cancelPurchaseOrder = (id)       => axiosInstance.delete(`/purchase-orders/${id}`)