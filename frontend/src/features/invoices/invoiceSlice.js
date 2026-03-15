import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import * as api from "../../api/invoiceApi"
import { toast } from "react-toastify"

export const getInvoices = createAsyncThunk(
  "invoices/getAll",
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.fetchInvoices(params)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch invoices")
    }
  }
)

export const addInvoice = createAsyncThunk(
  "invoices/add",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.createInvoice(data)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create invoice")
    }
  }
)

export const editInvoice = createAsyncThunk(
  "invoices/edit",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.updateInvoice(id, data)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update invoice")
    }
  }
)

export const removeInvoice = createAsyncThunk(
  "invoices/remove",
  async (id, { rejectWithValue }) => {
    try {
      await api.deleteInvoice(id)
      return id
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete invoice")
    }
  }
)

const invoiceSlice = createSlice({
  name: "invoices",
  initialState: {
    items:       [],
    total:       0,
    totalPages:  1,
    currentPage: 1,
    isLoading:   false,
    error:       null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getInvoices.pending,    (state) => { state.isLoading = true })
      .addCase(getInvoices.fulfilled,  (state, action) => {
        state.isLoading   = false
        state.items       = action.payload.data
        state.total       = action.payload.total
        state.totalPages  = action.payload.totalPages
        state.currentPage = action.payload.currentPage
      })
      .addCase(getInvoices.rejected,   (state, action) => {
        state.isLoading = false
        toast.error(action.payload)
      })
      .addCase(addInvoice.fulfilled,   (state, action) => {
        state.items.unshift(action.payload.data)
        toast.success("Invoice created! ✅")
      })
      .addCase(addInvoice.rejected,    (_, action) => { toast.error(action.payload) })
      .addCase(editInvoice.fulfilled,  (state, action) => {
        const index = state.items.findIndex(i => i._id === action.payload.data._id)
        if (index !== -1) state.items[index] = action.payload.data
        toast.success("Invoice updated! ✅")
      })
      .addCase(editInvoice.rejected,   (_, action) => { toast.error(action.payload) })
      .addCase(removeInvoice.fulfilled,(state, action) => {
        state.items = state.items.filter(i => i._id !== action.payload)
        toast.success("Invoice deleted! ✅")
      })
      .addCase(removeInvoice.rejected, (_, action) => { toast.error(action.payload) })
  },
})

export default invoiceSlice.reducer