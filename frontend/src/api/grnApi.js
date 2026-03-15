import axiosInstance from "./axiosInstance"

// grn APIs connnect with backend endpoints 
export const fetchGRNs  = (params) => axiosInstance.get("/grn", { params })
export const fetchGRN   = (id)     => axiosInstance.get(`/grn/${id}`)
export const createGRN  = (data)   => axiosInstance.post("/grn", data)