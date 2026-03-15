// src/pages/grn/GRNPage.jsx
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getGRNs } from "../../features/grn/grnSlice"

import {
  Box, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, Pagination,
  CircularProgress, Chip
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import GRNForm from "./GRNForm"

const statusColors = {
  complete: "success",
  partial:  "warning",
}

const GRNPage = () => {
  const dispatch = useDispatch()
  const { items, totalPages, isLoading } = useSelector((state) => state.grn)

  const [page,     setPage]     = useState(1)
  const [openForm, setOpenForm] = useState(false)

  useEffect(() => {
    dispatch(getGRNs({ page, limit: 10 }))
  }, [dispatch, page])

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">Goods Receipt Notes (GRN)</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenForm(true)}>
          Create GRN
        </Button>
      </Box>

      {/* Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell><b>Purchase Order</b></TableCell>
              <TableCell><b>Supplier</b></TableCell>
              <TableCell><b>Received Items</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Receipt Date</b></TableCell>
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
                  <Typography color="text.secondary">No GRNs found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              items.map((grn) => (
                <TableRow key={grn._id} hover>
                  <TableCell>{grn.purchaseOrder?._id?.slice(-6).toUpperCase() || "—"}</TableCell>
                  <TableCell>{grn.purchaseOrder?.supplier?.name || "—"}</TableCell>
                  <TableCell>
                    {grn.receivedItems?.map((item, i) => (
                      <Typography key={i} variant="caption" display="block">
                        {item.product?.title} — Ordered: {item.orderedQuantity} | Received: {item.receivedQuantity}
                      </Typography>
                    ))}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={grn.status}
                      color={statusColors[grn.status] || "default"}
                      size="small"
                      sx={{ textTransform: "capitalize" }}
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(grn.receiptDate).toLocaleDateString()}
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

      <GRNForm open={openForm} onClose={() => setOpenForm(false)} />
    </Box>
  )
}

export default GRNPage