import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import * as api from "../../api/productApi"
import { toast } from "react-toastify"

// ── Async Thunks ───────────────────────────────────────────────

export const getProducts = createAsyncThunk(
  "products/getAll",
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.fetchProducts(params)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch products")
    }
  }
)

export const addProduct = createAsyncThunk(
  "products/add",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.createProduct(data)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create product")
    }
  }
)

export const editProduct = createAsyncThunk(
  "products/edit",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.updateProduct(id, data)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update product")
    }
  }
)

export const removeProduct = createAsyncThunk(
  "products/remove",
  async (id, { rejectWithValue }) => {
    try {
      await api.deleteProduct(id)
      return id
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete product")
    }
  }
)

// ── Slice ──────────────────────────────────────────────────────

const productSlice = createSlice({
  name: "products",
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
      // Get All
      .addCase(getProducts.pending,   (state) => { state.isLoading = true })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.isLoading   = false
        state.items       = action.payload.data
        state.total       = action.payload.total
        state.totalPages  = action.payload.totalPages
        state.currentPage = action.payload.currentPage
      })
      .addCase(getProducts.rejected,  (state, action) => {
        state.isLoading = false
        state.error     = action.payload
        toast.error(action.payload)
      })

      // Add
      .addCase(addProduct.fulfilled, (state, action) => {
        state.items.unshift(action.payload.data)
        toast.success("Product created successfully! ✅")
      })
      .addCase(addProduct.rejected, (_, action) => {
        toast.error(action.payload)
      })

      // Edit
      .addCase(editProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex(p => p._id === action.payload.data._id)
        if (index !== -1) state.items[index] = action.payload.data
        toast.success("Product updated successfully! ✅")
      })
      .addCase(editProduct.rejected, (_, action) => {
        toast.error(action.payload)
      })

      // Remove
      .addCase(removeProduct.fulfilled, (state, action) => {
        state.items = state.items.filter(p => p._id !== action.payload)
        toast.success("Product deleted successfully! ✅")
      })
      .addCase(removeProduct.rejected, (_, action) => {
        toast.error(action.payload)
      })
  },
})

export default productSlice.reducer