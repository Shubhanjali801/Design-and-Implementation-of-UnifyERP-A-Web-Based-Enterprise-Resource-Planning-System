// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
// import axiosInstance from "../../api/axiosInstance"
// import { toast } from "react-toastify"
// 
// // ── Async Actions ──────────────────────────────────────────────
// 
// export const loginUser = createAsyncThunk(
//   "auth/login",
//   async (credentials, { rejectWithValue }) => {
//     try {
//       const res = await axiosInstance.post("/auth/login", credentials)
//       return res.data
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || error.message || "Login failed")
//       
//     }
//   }
// )
// 
// export const logoutUser = createAsyncThunk(
//   "auth/logout",
//   async (_, { rejectWithValue }) => {
//     try {
//       await axiosInstance.post("/auth/logout")
//       return true
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || error.message || "Logout failed")
//     }
//   }
// )
// 
// // ── Initial State ──────────────────────────────────────────────
// 
// const token = localStorage.getItem("token")
// const user  = JSON.parse(localStorage.getItem("user") || "null")
// 
// const initialState = {
//   token:     token || null,
//   user:      user  || null,
//   isLoading: false,
//   error:     null,
// }
// 
// // ── Slice ──────────────────────────────────────────────────────
// 
// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     clearError: (state) => { state.error = null },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Login
//       .addCase(loginUser.pending, (state) => {
//         state.isLoading = true
//         state.error = null
//       })
//       .addCase(loginUser.fulfilled, (state, action) => {
//         state.isLoading = false
//         state.token = action.payload.token
//         state.user  = action.payload.user
//         localStorage.setItem("token", action.payload.token)
//         localStorage.setItem("user", JSON.stringify(action.payload.user))
//         toast.success("Login successful! Welcome 👋")
//       })
//       .addCase(loginUser.rejected, (state, action) => {
//         state.isLoading = false
//         state.error = action.payload
//         toast.error(action.payload)
//       })
// 
//       // Logout
//       .addCase(logoutUser.fulfilled, (state) => {
//         state.token = null
//         state.user  = null
//         localStorage.removeItem("token")
//         localStorage.removeItem("user")
//         toast.success("Logged out successfully!")
//       })
//   },
// })
// 
// export const { clearError } = authSlice.actions
// export default authSlice.reducer

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axiosInstance from "../../api/axiosInstance"
import { toast } from "react-toastify"

// ── Async Actions ──────────────────────────────────────────────

// Login
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/login", credentials)
      return res.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Login failed"
      )
    }
  }
)

// Logout
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.post("/auth/logout")
      return true
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Logout failed"
      )
    }
  }
)

// ── Initial State ──────────────────────────────────────────────

const token = localStorage.getItem("token")

let user = null
try {
  user = JSON.parse(localStorage.getItem("user"))
} catch {
  user = null
}

const initialState = {
  token: token || null,
  user: user || null,
  isLoading: false,
  error: null,
}

// ── Slice ──────────────────────────────────────────────────────

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.token = action.payload.token
        state.user = action.payload.user

        localStorage.setItem("token", action.payload.token)
        localStorage.setItem("user", JSON.stringify(action.payload.user))

        toast.success("Login successful! Welcome 👋")
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload

        toast.error(action.payload)
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.token = null
        state.user = null

        localStorage.removeItem("token")
        localStorage.removeItem("user")

        toast.success("Logged out successfully!")
      })
  },
})

export const { clearError } = authSlice.actions
export default authSlice.reducer