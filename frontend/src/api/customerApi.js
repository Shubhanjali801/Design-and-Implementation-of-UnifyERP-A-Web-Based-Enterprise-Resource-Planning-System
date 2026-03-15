import axiosInstance from "./axiosInstance"

// customers APIs connnect with backend endpoints 
export const fetchCustomers = (params) => axiosInstance.get("/customers", { params })
export const fetchCustomer  = (id)     => axiosInstance.get(`/customers/${id}`)
export const createCustomer = (data)   => axiosInstance.post("/customers", data)
export const updateCustomer = (id, data) => axiosInstance.put(`/customers/${id}`, data)
export const deleteCustomer = (id)     => axiosInstance.delete(`/customers/${id}`)