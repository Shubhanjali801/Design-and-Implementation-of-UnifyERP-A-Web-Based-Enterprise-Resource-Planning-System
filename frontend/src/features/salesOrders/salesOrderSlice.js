import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import * as api from "../../api/salesOrderApi"
import { toast } from "react-toastify"

export const getSalesOrders = createAsyncThunk(
  "salesOrders/getAll",
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.fetchSalesOrders(params)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch sales orders")
    }
  }
)

export const addSalesOrder = createAsyncThunk(
  "salesOrders/add",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.createSalesOrder(data)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create sales order")
    }
  }
)

export const editSalesOrder = createAsyncThunk(
  "salesOrders/edit",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.updateSalesOrder(id, data)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update sales order")
    }
  }
)

export const removeSalesOrder = createAsyncThunk(
  "salesOrders/remove",
  async (id, { rejectWithValue }) => {
    try {
      await api.cancelSalesOrder(id)
      return id
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to cancel sales order")
    }
  }
)

const salesOrderSlice = createSlice({
  name: "salesOrders",
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
      .addCase(getSalesOrders.pending,    (state) => { state.isLoading = true })
      .addCase(getSalesOrders.fulfilled,  (state, action) => {
        state.isLoading   = false
        state.items       = action.payload.data
        state.total       = action.payload.total
        state.totalPages  = action.payload.totalPages
        state.currentPage = action.payload.currentPage
      })
      .addCase(getSalesOrders.rejected,   (state, action) => {
        state.isLoading = false
        toast.error(action.payload)
      })
      .addCase(addSalesOrder.fulfilled,   (state, action) => {
        state.items.unshift(action.payload.data)
        toast.success("Sales order created! ✅")
      })
      .addCase(addSalesOrder.rejected,    (_, action) => { toast.error(action.payload) })
      .addCase(editSalesOrder.fulfilled,  (state, action) => {
        const index = state.items.findIndex(o => o._id === action.payload.data._id)
        if (index !== -1) state.items[index] = action.payload.data
        toast.success("Sales order updated! ✅")
      })
      .addCase(editSalesOrder.rejected,   (_, action) => { toast.error(action.payload) })
      .addCase(removeSalesOrder.fulfilled,(state, action) => {
        state.items = state.items.filter(o => o._id !== action.payload)
        toast.success("Sales order cancelled! ✅")
      })
      .addCase(removeSalesOrder.rejected, (_, action) => { toast.error(action.payload) })
  },
})

export default salesOrderSlice.reducer