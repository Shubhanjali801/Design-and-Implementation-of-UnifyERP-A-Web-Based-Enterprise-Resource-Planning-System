
// src/pages/admin/UsersPage.jsx
import { useEffect, useState,useCallback } from "react"
import {  useSelector } from "react-redux"
// import { useDispatch, useSelector } from "react-redux"
import axiosInstance from "../../api/axiosInstance"
import { toast } from "react-toastify"

import {
  Box, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, Pagination,
  CircularProgress, Chip, IconButton, TextField,
  InputAdornment, Dialog, DialogTitle, DialogContent,
  DialogActions, MenuItem
} from "@mui/material"
import EditIcon   from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import SearchIcon from "@mui/icons-material/Search"

const roleColors = {
  admin:     "error",
  sales:     "primary",
  purchase:  "warning",
  inventory: "success",
}

const roles = ["admin", "sales", "purchase", "inventory"]

// ── Edit User Dialog ───────────────────────────────────────────
const EditUserDialog = ({ open, onClose, user, onUpdated }) => {
  const [role, setRole]   = useState("")
  const [name, setName]   = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setRole(user.role)
      setName(user.name)
    }
  }, [user])

  const handleSave = async () => {
    try {
      setLoading(true)
      await axiosInstance.put(`/auth/users/${user._id}`, { name, role })
      toast.success("User updated successfully! ✅")
      onUpdated()
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update user")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Edit User</DialogTitle>
      <DialogContent>
        <TextField
          label="Name" fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mt: 1, mb: 2 }}
        />
        <TextField
          label="Role" select fullWidth
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          {roles.map((r) => (
            <MenuItem key={r} value={r} sx={{ textTransform: "capitalize" }}>
              {r}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button variant="contained" onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

// ── Main Page ──────────────────────────────────────────────────
const UsersPage = () => {
  const currentUser = useSelector((state) => state.auth.user)

  const [users,       setUsers]       = useState([])
  const [total,       setTotal]       = useState(0)
  const [totalPages,  setTotalPages]  = useState(1)
  const [page,        setPage]        = useState(1)
  const [search,      setSearch]      = useState("")
  const [isLoading,   setIsLoading]   = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [openEdit,    setOpenEdit]    = useState(false)

const fetchUsers = useCallback(async () => {
  try {
    setIsLoading(true)
    const res = await axiosInstance.get("/auth/users", {
      params: { page, limit: 10, search }
    })
    setUsers(res.data.data)
    setTotal(res.data.total)
    setTotalPages(res.data.totalPages)
  } catch {
    toast.error("Failed to fetch users")
  } finally {
    setIsLoading(false)
  }
}, [page, search])  // ← fetchUsers depends on page and search

useEffect(() => {
  fetchUsers()
}, [fetchUsers])  // ← now fetchUsers is in deps, no warning!


  const handleEdit = (user) => {
    setEditingUser(user)
    setOpenEdit(true)
  }

  const handleDelete = async (id) => {
    // Prevent admin from deleting themselves
    if (id === currentUser._id) {
      return toast.error("You cannot delete your own account!")
    }
    if (!window.confirm("Delete this user permanently?")) return

    try {
      await axiosInstance.delete(`/auth/users/${id}`)
      toast.success("User deleted successfully! ✅")
      fetchUsers()
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete user")
    }
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight="bold">User Management</Typography>
          <Typography variant="body2" color="text.secondary">
            Total {total} users registered
          </Typography>
        </Box>
      </Box>

      {/* Search */}
      <TextField
        placeholder="Search by name or email..."
        size="small"
        sx={{ mb: 2, width: 300 }}
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1) }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          )
        }}
      />

      {/* Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell><b>Name</b></TableCell>
              <TableCell><b>Email</b></TableCell>
              <TableCell><b>Role</b></TableCell>
              <TableCell><b>Joined</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">No users found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user._id} hover>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {user.name}
                      {user._id === currentUser._id && (
                        <Chip label="You" size="small" color="primary" />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.role}
                      color={roleColors[user.role] || "default"}
                      size="small"
                      sx={{ textTransform: "capitalize" }}
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(user)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(user._id)}
                      disabled={user._id === currentUser._id}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Pagination
          count={totalPages} page={page}
          onChange={(_, val) => setPage(val)} color="primary"
        />
      </Box>

      {/* Edit Dialog */}
      <EditUserDialog
        open={openEdit}
        onClose={() => { setOpenEdit(false); setEditingUser(null) }}
        user={editingUser}
        onUpdated={fetchUsers}
      />
    </Box>
  )
}

export default UsersPage