import axiosInstance from "./axiosInstance"

// suppliers APIs connnect with backend endpoints
export const fetchSuppliers = (params)     => axiosInstance.get("/suppliers", { params })
export const fetchSupplier  = (id)         => axiosInstance.get(`/suppliers/${id}`)
export const createSupplier = (data)       => axiosInstance.post("/suppliers", data)
export const updateSupplier = (id, data)   => axiosInstance.put(`/suppliers/${id}`, data)
export const deleteSupplier = (id)         => axiosInstance.delete(`/suppliers/${id}`)