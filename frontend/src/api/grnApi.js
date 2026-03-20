import axiosInstance from "./axiosInstance"
const BASE = import.meta.env.VITE_API_URL 

// grn APIs connnect with backend endpoints 
export const fetchGRNs  = (params) => axiosInstance.get(`${BASE}/grn`, { params })
export const fetchGRN   = (id)     => axiosInstance.get(`${BASE}/grn/${id}`)
export const createGRN  = (data)   => axiosInstance.post(`${BASE}/grn`, data)