import axiosInstance from "./axiosInstance"
const BASE = import.meta.env.VITE_API_URL

// invoices APIs connnect with backend endpoints
export const fetchInvoices = (params)     => axiosInstance.get(`${BASE}/invoices`, { params })
export const fetchInvoice  = (id)         => axiosInstance.get(`${BASE}/invoices/${id}`)
export const createInvoice = (data)       => axiosInstance.post(`${BASE}/invoices`, data)
export const updateInvoice = (id, data)   => axiosInstance.put(`${BASE}/invoices/${id}`, data)
export const deleteInvoice = (id)         => axiosInstance.delete(`${BASE}/invoices/${id}`)