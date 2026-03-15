import { useSelector } from "react-redux"
import { useLocation } from "react-router-dom"
import { AppBar, Toolbar, Typography, Box, Chip } from "@mui/material"

// Map paths to page titles
const pageTitles = {
  "/dashboard":       "Dashboard",
  "/products":        "Products",
  "/customers":       "Customers",
  "/suppliers":       "Suppliers",
  "/sales-orders":    "Sales Orders",
  "/purchase-orders": "Purchase Orders",
  "/grn":             "Goods Receipt Notes",
  "/invoices":        "Invoices",
  "/admin/users":     "User Management",
}

// Role colors
const roleColors = {
  admin:     "error",
  sales:     "primary",
  purchase:  "warning",
  inventory: "success",
}

const Topbar = () => {
  const { user }   = useSelector((state) => state.auth)
  const location   = useLocation()
  const pageTitle  = pageTitles[location.pathname] || "ERP System"

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: "#fff",
        borderBottom: "1px solid #e0e0e0",
        color: "#333",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>

        {/* Page Title */}
        <Typography variant="h6" fontWeight="bold">
          {pageTitle}
        </Typography>

        {/* Right side — role badge + greeting */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Hello, {user?.name} 👋
          </Typography>
          <Chip
            label={user?.role?.toUpperCase()}
            color={roleColors[user?.role] || "default"}
            size="small"
          />
        </Box>

      </Toolbar>
    </AppBar>
  )
}

export default Topbar