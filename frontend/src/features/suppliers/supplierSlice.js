import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import * as api from "../../api/supplierApi"
import { toast } from "react-toastify"

export const getSuppliers = createAsyncThunk(
  "suppliers/getAll",
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.fetchSuppliers(params)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch suppliers")
    }
  }
)

export const addSupplier = createAsyncThunk(
  "suppliers/add",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.createSupplier(data)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create supplier")
    }
  }
)

export const editSupplier = createAsyncThunk(
  "suppliers/edit",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.updateSupplier(id, data)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update supplier")
    }
  }
)

export const removeSupplier = createAsyncThunk(
  "suppliers/remove",
  async (id, { rejectWithValue }) => {
    try {
      await api.deleteSupplier(id)
      return id
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete supplier")
    }
  }
)

const supplierSlice = createSlice({
  name: "suppliers",
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
      .addCase(getSuppliers.pending,    (state) => { state.isLoading = true })
      .addCase(getSuppliers.fulfilled,  (state, action) => {
        state.isLoading   = false
        state.items       = action.payload.data
        state.total       = action.payload.total
        state.totalPages  = action.payload.totalPages
        state.currentPage = action.payload.currentPage
      })
      .addCase(getSuppliers.rejected,   (state, action) => {
        state.isLoading = false
        toast.error(action.payload)
      })
      .addCase(addSupplier.fulfilled,   (state, action) => {
        state.items.unshift(action.payload.data)
        toast.success("Supplier added successfully! ✅")
      })
      .addCase(addSupplier.rejected,    (_, action) => { toast.error(action.payload) })
      .addCase(editSupplier.fulfilled,  (state, action) => {
        const index = state.items.findIndex(s => s._id === action.payload.data._id)
        if (index !== -1) state.items[index] = action.payload.data
        toast.success("Supplier updated successfully! ✅")
      })
      .addCase(editSupplier.rejected,   (_, action) => { toast.error(action.payload) })
      .addCase(removeSupplier.fulfilled,(state, action) => {
        state.items = state.items.filter(s => s._id !== action.payload)
        toast.success("Supplier deleted successfully! ✅")
      })
      .addCase(removeSupplier.rejected, (_, action) => { toast.error(action.payload) })
  },
})

export default supplierSlice.reducer