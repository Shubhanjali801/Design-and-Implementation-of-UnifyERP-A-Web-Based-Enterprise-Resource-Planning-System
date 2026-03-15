import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import * as api from "../../api/grnApi"
import { toast } from "react-toastify"

export const getGRNs = createAsyncThunk(
  "grn/getAll",
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.fetchGRNs(params)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch GRNs")
    }
  }
)

export const addGRN = createAsyncThunk(
  "grn/add",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.createGRN(data)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create GRN")
    }
  }
)

const grnSlice = createSlice({
  name: "grn",
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
      .addCase(getGRNs.pending,   (state) => { state.isLoading = true })
      .addCase(getGRNs.fulfilled, (state, action) => {
        state.isLoading   = false
        state.items       = action.payload.data
        state.total       = action.payload.total
        state.totalPages  = action.payload.totalPages
        state.currentPage = action.payload.currentPage
      })
      .addCase(getGRNs.rejected,  (state, action) => {
        state.isLoading = false
        toast.error(action.payload)
      })
      .addCase(addGRN.fulfilled, (state, action) => {
        state.items.unshift(action.payload.data)
        toast.success("GRN created successfully! ✅")
      })
      .addCase(addGRN.rejected, (_, action) => {
        toast.error(action.payload)
      })
  },
})

export default grnSlice.reducer