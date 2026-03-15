// src/pages/suppliers/SuppliersPage.jsx
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getSuppliers, removeSupplier } from "../../features/suppliers/supplierSlice"

import {
  Box, Button, TextField, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, IconButton,
  Typography, Pagination, CircularProgress, InputAdornment
} from "@mui/material"
import AddIcon    from "@mui/icons-material/Add"
import EditIcon   from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import SearchIcon from "@mui/icons-material/Search"

import SupplierForm from "./SupplierForm"

const SuppliersPage = () => {
  const dispatch = useDispatch()
  const { items, totalPages, isLoading } = useSelector((state) => state.suppliers)

  const [search,          setSearch]          = useState("")
  const [page,            setPage]            = useState(1)
  const [openForm,        setOpenForm]        = useState(false)
  const [editingSupplier, setEditingSupplier] = useState(null)

  useEffect(() => {
    dispatch(getSuppliers({ page, limit: 10, search }))
  }, [dispatch, page, search])

  const handleEdit = (supplier) => {
    setEditingSupplier(supplier)
    setOpenForm(true)
  }

  const handleDelete = (id) => {
    if (window.confirm("Delete this supplier?")) {
      dispatch(removeSupplier(id))
    }
  }

  const handleCloseForm = () => {
    setOpenForm(false)
    setEditingSupplier(null)
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">Suppliers</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenForm(true)}>
          Add Supplier
        </Button>
      </Box>

      <TextField
        placeholder="Search suppliers..."
        size="small"
        sx={{ mb: 2, width: 300 }}
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1) }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>
          )
        }}
      />

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell><b>Name</b></TableCell>
              <TableCell><b>Contact</b></TableCell>
              <TableCell><b>Email</b></TableCell>
              <TableCell><b>Address</b></TableCell>
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
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">No suppliers found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              items.map((supplier) => (
                <TableRow key={supplier._id} hover>
                  <TableCell>{supplier.name}</TableCell>
                  <TableCell>{supplier.contact}</TableCell>
                  <TableCell>{supplier.email || "—"}</TableCell>
                  <TableCell>{supplier.address}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleEdit(supplier)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(supplier._id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Pagination
          count={totalPages} page={page}
          onChange={(_, val) => setPage(val)} color="primary"
        />
      </Box>

      <SupplierForm open={openForm} onClose={handleCloseForm} editingSupplier={editingSupplier} />
    </Box>
  )
}

export default SuppliersPage
