import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import * as api from "../../api/purchaseOrderApi"
import { toast } from "react-toastify"

export const getPurchaseOrders = createAsyncThunk(
  "purchaseOrders/getAll",
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.fetchPurchaseOrders(params)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch purchase orders")
    }
  }
)

export const addPurchaseOrder = createAsyncThunk(
  "purchaseOrders/add",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.createPurchaseOrder(data)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create purchase order")
    }
  }
)

export const editPurchaseOrder = createAsyncThunk(
  "purchaseOrders/edit",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.updatePurchaseOrder(id, data)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update purchase order")
    }
  }
)

export const removePurchaseOrder = createAsyncThunk(
  "purchaseOrders/remove",
  async (id, { rejectWithValue }) => {
    try {
      await api.cancelPurchaseOrder(id)
      return id
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to cancel purchase order")
    }
  }
)

const purchaseOrderSlice = createSlice({
  name: "purchaseOrders",
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
      .addCase(getPurchaseOrders.pending,    (state) => { state.isLoading = true })
      .addCase(getPurchaseOrders.fulfilled,  (state, action) => {
        state.isLoading   = false
        state.items       = action.payload.data
        state.total       = action.payload.total
        state.totalPages  = action.payload.totalPages
        state.currentPage = action.payload.currentPage
      })
      .addCase(getPurchaseOrders.rejected,   (state, action) => {
        state.isLoading = false
        toast.error(action.payload)
      })
      .addCase(addPurchaseOrder.fulfilled,   (state, action) => {
        state.items.unshift(action.payload.data)
        toast.success("Purchase order created! ✅")
      })
      .addCase(addPurchaseOrder.rejected,    (_, action) => { toast.error(action.payload) })
      .addCase(editPurchaseOrder.fulfilled,  (state, action) => {
        const index = state.items.findIndex(o => o._id === action.payload.data._id)
        if (index !== -1) state.items[index] = action.payload.data
        toast.success("Purchase order updated! ✅")
      })
      .addCase(editPurchaseOrder.rejected,   (_, action) => { toast.error(action.payload) })
      .addCase(removePurchaseOrder.fulfilled,(state, action) => {
        state.items = state.items.filter(o => o._id !== action.payload)
        toast.success("Purchase order cancelled! ✅")
      })
      .addCase(removePurchaseOrder.rejected, (_, action) => { toast.error(action.payload) })
  },
})

export default purchaseOrderSlice.reducer