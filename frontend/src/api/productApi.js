import axiosInstance from "./axiosInstance"

// products APIs connnect with backend endpoints
export const fetchProducts    = (params) => axiosInstance.get("/products", { params })
export const fetchProduct     = (id)     => axiosInstance.get(`/products/${id}`)
export const createProduct    = (data)   => axiosInstance.post("/products", data)
export const updateProduct    = (id, data) => axiosInstance.put(`/products/${id}`, data)
export const deleteProduct    = (id)     => axiosInstance.delete(`/products/${id}`)
export const fetchLowStock    = ()       => axiosInstance.get("/products/low-stock")