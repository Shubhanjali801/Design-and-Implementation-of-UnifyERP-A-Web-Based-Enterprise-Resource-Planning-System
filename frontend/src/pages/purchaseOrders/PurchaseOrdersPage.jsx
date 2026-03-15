// src/pages/purchaseOrders/PurchaseOrdersPage.jsx
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getPurchaseOrders, removePurchaseOrder, editPurchaseOrder } from "../../features/purchaseOrders/purchaseOrderSlice"

import {
  Box, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Typography,
  Pagination, CircularProgress, Chip, MenuItem, Select
} from "@mui/material"
import AddIcon    from "@mui/icons-material/Add"
import DeleteIcon from "@mui/icons-material/Delete"

import PurchaseOrderForm from "./PurchaseOrderForm"

const statusColors = {
  pending:   "warning",
  confirmed: "info",
  received:  "success",
  cancelled: "error",
}

const PurchaseOrdersPage = () => {
  const dispatch = useDispatch()
  const { items, totalPages, isLoading } = useSelector((state) => state.purchaseOrders)

  const [page,      setPage]      = useState(1)
  const [openForm,  setOpenForm]  = useState(false)

  useEffect(() => {
    dispatch(getPurchaseOrders({ page, limit: 10 }))
  }, [dispatch, page])

  const handleCancel = (id) => {
    if (window.confirm("Cancel this purchase order?")) {
      dispatch(removePurchaseOrder(id))
    }
  }

  const handleStatusChange = (id, status) => {
    dispatch(editPurchaseOrder({ id, data: { status } }))
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">Purchase Orders</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenForm(true)}>
          New Purchase Order
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell><b>Supplier</b></TableCell>
              <TableCell><b>Products</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Date</b></TableCell>
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
                  <Typography color="text.secondary">No purchase orders found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              items.map((order) => (
                <TableRow key={order._id} hover>
                  <TableCell>{order.supplier?.name || "—"}</TableCell>
                  <TableCell>
                    {order.products?.map(p => (
                      <Typography key={p._id} variant="caption" display="block">
                        {p.product?.title} × {p.quantity} — ₹{p.price}
                      </Typography>
                    ))}
                  </TableCell>
                  <TableCell>
                    {order.status === "received" || order.status === "cancelled" ? (
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
                        {["pending","confirmed","received","cancelled"].map(s => (
                          <MenuItem key={s} value={s} sx={{ textTransform: "capitalize" }}>{s}</MenuItem>
                        ))}
                      </Select>
                    )}
                  </TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <IconButton
                      color="error"
                      disabled={order.status === "received" || order.status === "cancelled"}
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

      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Pagination
          count={totalPages} page={page}
          onChange={(_, val) => setPage(val)} color="primary"
        />
      </Box>

      <PurchaseOrderForm open={openForm} onClose={() => setOpenForm(false)} />
    </Box>
  )
}

export default PurchaseOrdersPage