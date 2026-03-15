import axiosInstance from "./axiosInstance"

// invoices APIs connnect with backend endpoints
export const fetchInvoices = (params)     => axiosInstance.get("/invoices", { params })
export const fetchInvoice  = (id)         => axiosInstance.get(`/invoices/${id}`)
export const createInvoice = (data)       => axiosInstance.post("/invoices", data)
export const updateInvoice = (id, data)   => axiosInstance.put(`/invoices/${id}`, data)
export const deleteInvoice = (id)         => axiosInstance.delete(`/invoices/${id}`)