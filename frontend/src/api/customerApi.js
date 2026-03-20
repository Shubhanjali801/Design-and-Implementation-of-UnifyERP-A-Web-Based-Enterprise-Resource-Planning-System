import axiosInstance from "./axiosInstance"
const BASE = import.meta.env.VITE_API_URL 

// customers APIs connnect with backend endpoints 
export const fetchCustomers = (params) => axiosInstance.get(`${BASE}/customers`, { params })
export const fetchCustomer  = (id)     => axiosInstance.get(`${BASE}/customers/${id}`)
export const createCustomer = (data)   => axiosInstance.post(`${BASE}/customers`, data)
export const updateCustomer = (id, data) => axiosInstance.put(`${BASE}/customers/${id}`, data)
export const deleteCustomer = (id)     => axiosInstance.delete(`${BASE}/customers/${id}`)