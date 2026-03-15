import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import * as api from "../../api/customerApi"
import { toast } from "react-toastify"

export const getCustomers = createAsyncThunk(
  "customers/getAll",
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.fetchCustomers(params)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch customers")
    }
  }
)

export const addCustomer = createAsyncThunk(
  "customers/add",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.createCustomer(data)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create customer")
    }
  }
)

export const editCustomer = createAsyncThunk(
  "customers/edit",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.updateCustomer(id, data)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update customer")
    }
  }
)

export const removeCustomer = createAsyncThunk(
  "customers/remove",
  async (id, { rejectWithValue }) => {
    try {
      await api.deleteCustomer(id)
      return id
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete customer")
    }
  }
)

const customerSlice = createSlice({
  name: "customers",
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
      .addCase(getCustomers.pending,   (state) => { state.isLoading = true })
      .addCase(getCustomers.fulfilled, (state, action) => {
        state.isLoading   = false
        state.items       = action.payload.data
        state.total       = action.payload.total
        state.totalPages  = action.payload.totalPages
        state.currentPage = action.payload.currentPage
      })
      .addCase(getCustomers.rejected,  (state, action) => {
        state.isLoading = false
        toast.error(action.payload)
      })
      .addCase(addCustomer.fulfilled,  (state, action) => {
        state.items.unshift(action.payload.data)
        toast.success("Customer added successfully! ✅")
      })
      .addCase(addCustomer.rejected,   (_, action) => { toast.error(action.payload) })
      .addCase(editCustomer.fulfilled, (state, action) => {
        const index = state.items.findIndex(c => c._id === action.payload.data._id)
        if (index !== -1) state.items[index] = action.payload.data
        toast.success("Customer updated successfully! ✅")
      })
      .addCase(editCustomer.rejected,  (_, action) => { toast.error(action.payload) })
      .addCase(removeCustomer.fulfilled, (state, action) => {
        state.items = state.items.filter(c => c._id !== action.payload)
        toast.success("Customer deleted successfully! ✅")
      })
      .addCase(removeCustomer.rejected, (_, action) => { toast.error(action.payload) })
  },
})

export default customerSlice.reducer