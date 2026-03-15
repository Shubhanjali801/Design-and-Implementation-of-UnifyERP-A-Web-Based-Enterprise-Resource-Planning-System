// src/pages/customers/CustomersPage.jsx
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getCustomers, removeCustomer } from "../../features/customers/customerSlice"

import {
  Box, Button, TextField, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, IconButton,
  Typography, Pagination, CircularProgress, InputAdornment
} from "@mui/material"
import AddIcon    from "@mui/icons-material/Add"
import EditIcon   from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import SearchIcon from "@mui/icons-material/Search"

import CustomerForm from "./CustomerForm"

const CustomersPage = () => {
  const dispatch = useDispatch()
  const { items, totalPages, isLoading } = useSelector((state) => state.customers)

  const [search,          setSearch]          = useState("")
  const [page,            setPage]            = useState(1)
  const [openForm,        setOpenForm]        = useState(false)
  const [editingCustomer, setEditingCustomer] = useState(null)

  useEffect(() => {
    dispatch(getCustomers({ page, limit: 10, search }))
  }, [dispatch, page, search])

  const handleEdit = (customer) => {
    setEditingCustomer(customer)
    setOpenForm(true)
  }

  const handleDelete = (id) => {
    if (window.confirm("Delete this customer?")) {
      dispatch(removeCustomer(id))
    }
  }

  const handleCloseForm = () => {
    setOpenForm(false)
    setEditingCustomer(null)
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">Customers</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenForm(true)}>
          Add Customer
        </Button>
      </Box>

      {/* Search */}
      <TextField
        placeholder="Search customers..."
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

      {/* Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell><b>Name</b></TableCell>
              <TableCell><b>Email</b></TableCell>
              <TableCell><b>Phone</b></TableCell>
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
                  <Typography color="text.secondary">No customers found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              items.map((customer) => (
                <TableRow key={customer._id} hover>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.email || "—"}</TableCell>
                  <TableCell>{customer.contact}</TableCell>
                  <TableCell>{customer.address}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleEdit(customer)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(customer._id)}>
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

      <CustomerForm open={openForm} onClose={handleCloseForm} editingCustomer={editingCustomer} />
    </Box>
  )
}

export default CustomersPage