import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { loginUser } from "../../features/auth/authSlice"

import {
    Box, Card, CardContent, TextField,
    Button, Typography, CircularProgress, InputAdornment, IconButton
} from "@mui/material"
import { Visibility, VisibilityOff, Inventory2 } from "@mui/icons-material"
import { useState } from "react"

// ── Validation Schema ──────────────────────────────────────────
const schema = yup.object({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().min(8, "Min 8 characters").required("Password is required"),
})

// ── Component ──────────────────────────────────────────────────
const LoginPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { isLoading, token } = useSelector((state) => state.auth)

    const [showPassword, setShowPassword] = useState(false)

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    })

    // If already logged in → redirect to dashboard
    useEffect(() => {
        if (token) navigate("/dashboard")
    }, [token, navigate])

    const onSubmit = (data) => {
        dispatch(loginUser(data))
    }

    return (
        <Box sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f0f2f5",
        }}>
            <Card sx={{ width: 420, borderRadius: 3, boxShadow: 5 }}>
                <CardContent sx={{ p: 4 }}>

                    {/* Logo / Title */}
                    <Box sx={{ textAlign: "center", mb: 3 }}>
                        <Inventory2 sx={{ fontSize: 48, color: "primary.main" }} />
                        <Typography variant="h5" fontWeight="bold" mt={1}>
                            ERP Management
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Sign in to your account
                        </Typography>
                    </Box>

                    {/* Form */}
                    <Box component="form" onSubmit={handleSubmit(onSubmit)}>

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
                                : "Sign In"
                            }
                        </Button>
                        {/* <Typography variant="body2" textAlign="center" mt={2} color="text.secondary">
                            Don't have an account?{" "}
                            <Link to="/register" style={{ color: "#1976d2", fontWeight: "bold" }}>
                                Register
                            </Link>
                        </Typography> */}

                    </Box>
                </CardContent>
            </Card>
        </Box>
    )
}

export default LoginPage
