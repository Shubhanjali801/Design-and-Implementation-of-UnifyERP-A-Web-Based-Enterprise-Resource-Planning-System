import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
// import { useDispatch, useSelector } from "react-redux"
import {  useSelector } from "react-redux"
import { useNavigate, Link } from "react-router-dom"
import axiosInstance from "../../api/axiosInstance"
import { toast } from "react-toastify"

import {
  Box, Card, CardContent, TextField, Button,
  Typography, CircularProgress, InputAdornment,
  IconButton, MenuItem
} from "@mui/material"
import { Visibility, VisibilityOff, Inventory2 } from "@mui/icons-material"

// ── Validation Schema ──────────────────────────────────────────
const schema = yup.object({
  name: yup.string().required("Name is required").min(2, "Min 2 characters"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(8, "Min 8 characters").required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords do not match")
    .required("Please confirm your password"),
  role: yup.string().required("Role is required"),
})

const roles = [
  { value: "admin",     label: "Admin" },
  { value: "sales",     label: "Sales" },
  { value: "purchase",  label: "Purchase" },
  { value: "inventory", label: "Inventory" },
]

// ── Component ──────────────────────────────────────────────────
const RegisterPage = () => {
  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)
  const [showPassword, setShowPassword]        = useState(false)
  const [showConfirm,  setShowConfirm]         = useState(false)
  const [isLoading,    setIsLoading]           = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { role: "sales" },
  })

  // Already logged in → go to dashboard
  useEffect(() => {
    if (token) navigate("/dashboard")
  }, [token, navigate])

  const onSubmit = async (data) => {
    try {
      setIsLoading(true)
      //  const { confirmPassword, ...payload } = data
      const {...payload } = data // remove confirmPassword before sending
      await axiosInstance.post("/auth/register", payload)
      toast.success("Registered successfully! Please login 🎉")
      navigate("/login")
    } catch (error) {
      toast.error(error.response?.data?.msg || "Registration failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box sx={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#f0f2f5",
    }}>
      <Card sx={{ width: 440, borderRadius: 3, boxShadow: 5 }}>
        <CardContent sx={{ p: 4 }}>

          {/* Logo / Title */}
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Inventory2 sx={{ fontSize: 48, color: "primary.main" }} />
            <Typography variant="h5" fontWeight="bold" mt={1}>
              Create Account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Register to access ERP System
            </Typography>
          </Box>

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>

            {/* Name */}
            <TextField
              label="Full Name"
              fullWidth
              margin="normal"
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
            />

            {/* Email */}
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            {/* Role */}
            <TextField
              label="Role"
              select
              fullWidth
              margin="normal"
              defaultValue="sales"
              {...register("role")}
              error={!!errors.role}
              helperText={errors.role?.message}
            >
              {roles.map((r) => (
                <MenuItem key={r.value} value={r.value}>
                  {r.label}
                </MenuItem>
              ))}
            </TextField>

            {/* Password */}
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              margin="normal"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            {/* Confirm Password */}
            <TextField
              label="Confirm Password"
              type={showConfirm ? "text" : "password"}
              fullWidth
              margin="normal"
              {...register("confirmPassword")}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirm(!showConfirm)}>
                      {showConfirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={isLoading}
              sx={{ mt: 3, borderRadius: 2, py: 1.5 }}
            >
              {isLoading
                ? <CircularProgress size={24} color="inherit" />
                : "Create Account"
              }
            </Button>

            {/* Login Link */}
            <Typography variant="body2" textAlign="center" mt={2} color="text.secondary">
              Already have an account?{" "}
              <Link to="/login" style={{ color: "#1976d2", fontWeight: "bold" }}>
                Sign In
              </Link>
            </Typography>

          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default RegisterPage