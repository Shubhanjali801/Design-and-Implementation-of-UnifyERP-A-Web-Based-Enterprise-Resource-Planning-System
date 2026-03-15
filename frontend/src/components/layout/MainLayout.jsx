import { Box } from "@mui/material"
import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"
import Topbar from "./Topbar"

const MainLayout = () => {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>

      {/* Sidebar — fixed left */}
      <Sidebar />

      {/* Right side — Topbar + Page Content */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", backgroundColor: "#f0f2f5" }}>

        {/* Topbar */}
        <Topbar />

        {/* Page Content — Outlet renders current page here */}
        <Box sx={{ flex: 1, p: 3, overflow: "auto" }}>
          <Outlet />
        </Box>

      </Box>
    </Box>
  )
}

export default MainLayout
