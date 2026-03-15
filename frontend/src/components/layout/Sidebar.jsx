// import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { logoutUser } from "../../features/auth/authSlice"
import DashboardIcon from "@mui/icons-material/Dashboard"
import InventoryIcon from "@mui/icons-material/Inventory"
import PeopleIcon from "@mui/icons-material/People"
import LocalShippingIcon from "@mui/icons-material/LocalShipping"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag"
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong"
import DescriptionIcon from "@mui/icons-material/Description"
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings"
import LogoutIcon from "@mui/icons-material/Logout"
import {
    Box, Drawer, List, ListItem, ListItemButton,
    ListItemIcon, ListItemText, Typography, Divider,
    Avatar, Tooltip
} from "@mui/material"


const DRAWER_WIDTH = 240

// ── Nav Items ──────────────────────────────────────────────────
const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: <DashboardIcon />, roles: ["admin", "sales", "purchase", "inventory"] },
    { label: "Products", path: "/products", icon: <InventoryIcon />, roles: ["admin", "inventory"] },
    { label: "Customers", path: "/customers", icon: <PeopleIcon />, roles: ["admin", "sales"] },
    { label: "Suppliers", path: "/suppliers", icon: <LocalShippingIcon />, roles: ["admin", "purchase"] },
    { label: "Sales Orders", path: "/sales-orders", icon: <ShoppingCartIcon />, roles: ["admin", "sales"] },
    { label: "Purchase Orders", path: "/purchase-orders", icon: <ShoppingBagIcon />, roles: ["admin", "purchase"] },
    { label: "GRN", path: "/grn", icon: <ReceiptLongIcon />, roles: ["admin", "inventory"] },
    { label: "Invoices", path: "/invoices", icon: <DescriptionIcon />, roles: ["admin", "sales"] },
    { label: "Users", path: "/admin/users", icon: <AdminPanelSettingsIcon />, roles: ["admin"] },
]

// ── Component ──────────────────────────────────────────────────
const Sidebar = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.auth)

    const handleLogout = () => {
        dispatch(logoutUser())
        navigate("/login")
    }

    // Filter nav items based on user role
    const visibleItems = navItems.filter((item) =>
        item.roles.includes(user?.role)
    )

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: DRAWER_WIDTH,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: DRAWER_WIDTH,
                    boxSizing: "border-box",
                    backgroundColor: "#1a1a2e",
                    color: "#fff",
                },
            }}
        >
            {/* Logo */}
            <Box sx={{ p: 3, textAlign: "center" }}>
                <Typography variant="h6" fontWeight="bold" color="primary.light">
                    🏢 Unify ERP Management System
                </Typography>                   
            </Box>

            <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />

            {/* Nav Links */}
            <List sx={{ flex: 1, px: 1, mt: 1 }}>
                {visibleItems.map((item) => {
                    const isActive = location.pathname === item.path
                    return (
                        <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton
                                onClick={() => navigate(item.path)}
                                sx={{
                                    borderRadius: 2,
                                    backgroundColor: isActive ? "primary.main" : "transparent",
                                    "&:hover": {
                                        backgroundColor: isActive ? "primary.main" : "rgba(255,255,255,0.08)",
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ color: "#fff", minWidth: 36 }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.label}
                                    primaryTypographyProps={{ fontSize: 14 }}
                                />
                            </ListItemButton>
                        </ListItem>
                    )
                })}
            </List>

            <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />

            {/* User Info + Logout */}
            <Box sx={{ p: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
                    <Avatar sx={{ bgcolor: "primary.main", width: 36, height: 36 }}>
                        {user?.name?.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                        <Typography variant="body2" fontWeight="bold" color="#fff">
                            {user?.name}
                        </Typography>
                        <Typography variant="caption" color="rgba(255,255,255,0.5)" sx={{ textTransform: "capitalize" }}>
                            {user?.role}
                        </Typography>
                    </Box>
                </Box>

                <Tooltip title="Logout">
                    <ListItemButton
                        onClick={handleLogout}
                        sx={{
                            borderRadius: 2,
                            color: "#ff6b6b",
                            "&:hover": { backgroundColor: "rgba(255,107,107,0.1)" },
                        }}
                    >
                        <ListItemIcon sx={{ color: "#ff6b6b", minWidth: 36 }}>
                            <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: 14 }} />
                    </ListItemButton>
                </Tooltip>
            </Box>
        </Drawer>
    )
}

export default Sidebar