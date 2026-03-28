// src/pages/salesOrders/SalesOrdersPage.jsx
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getSalesOrders, removeSalesOrder, editSalesOrder } from "../../features/salesOrders/salesOrderSlice"

import {
  Box, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Typography,
  Pagination, CircularProgress, Chip, MenuItem, Select
} from "@mui/material"
import AddIcon    from "@mui/icons-material/Add"
import EditIcon   from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"

import SalesOrderForm from "./SalesOrderForm"

const statusColors = {
  pending:   "warning",
  confirmed: "info",
  shipped:   "primary",
  delivered: "success",
  cancelled: "error",
}

const SalesOrdersPage = () => {
  const dispatch = useDispatch()
  const { items, totalPages, isLoading } = useSelector((state) => state.salesOrders)

  const [page,             setPage]             = useState(1)
  const [openForm,         setOpenForm]         = useState(false)
//   const [editingOrder,     setEditingOrder]     = useState(null)

  useEffect(() => {
    dispatch(getSalesOrders({ page, limit: 10 }))
  }, [dispatch, page])

  const handleCancel = (id) => {
    if (window.confirm("Cancel this sales order? Stock will be restored.")) {
      dispatch(removeSalesOrder(id))
    }
  }

  const handleStatusChange = (id, status) => {
    dispatch(editSalesOrder({ id, data: { status } }))
  }

  const handleCloseForm = () => {
    setOpenForm(false)
    // setEditingOrder(null)
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">Sales Orders</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenForm(true)}>
          New Order
        </Button>
      </Box>

      {/* Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell><b>Customer</b></TableCell>
              <TableCell><b>Products</b></TableCell>
              <TableCell><b>Total Price</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Date</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">No sales orders found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              items.map((order) => (
                <TableRow key={order._id} hover>
                  <TableCell>{order.customer?.name || "—"}</TableCell>
                  <TableCell>
                    {order.products?.map(p => (
                      <Typography key={p._id} variant="caption" display="block">
                        {p.product?.title} × {p.quantity}
                      </Typography>
                    ))}
                  </TableCell>
                  <TableCell>₹{order.totalPrice}</TableCell>
                  <TableCell>
                    {/* Inline status update dropdown */}
                    {order.status === "delivered" || order.status === "cancelled" ? (
                      <Chip
                        label={order.status}
                        color={statusColors[order.status]}
                        size="small"
                        sx={{ textTransform: "capitalize" }}
                      />
                    ) : (
                      <Select
                        value={order.status}
                        size="small"
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        sx={{ fontSize: 13 }}
                      >
                        {["pending","confirmed","shipped","delivered","cancelled"].map(s => (
                          <MenuItem key={s} value={s} sx={{ textTransform: "capitalize" }}>{s}</MenuItem>
                        ))}
                      </Select>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="error"
                      disabled={order.status === "delivered" || order.status === "cancelled"}
                      onClick={() => handleCancel(order._id)}
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

      <SalesOrderForm open={openForm} onClose={handleCloseForm} />
    </Box>
  )
}

export default SalesOrdersPage