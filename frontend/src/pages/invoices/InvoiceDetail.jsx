import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addInvoice, getInvoices } from "../../features/invoices/invoiceSlice"
import { getSalesOrders } from "../../features/salesOrders/salesOrderSlice"

import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Grid, MenuItem, TextField, Typography
} from "@mui/material"

const InvoiceDetail = ({ open, onClose }) => {
  const dispatch     = useDispatch()
  const salesOrders  = useSelector((state) => state.salesOrders?.items ?? [])

  const [salesOrderId, setSalesOrderId] = useState("")
  const [dueDate,      setDueDate]      = useState("")

  // Fetch sales orders
  useEffect(() => {
    if (open) {
      dispatch(getSalesOrders({ page: 1, limit: 100 }))
    }
  }, [open, dispatch])

  const handleClose = () => {
    setSalesOrderId("")
    setDueDate("")
    onClose()
  }

  const onSubmit = async () => {
    if (!salesOrderId) return alert("Please select a sales order")
    if (!dueDate)      return alert("Please select a due date")

    await dispatch(addInvoice({ salesOrder: salesOrderId, dueDate }))
    dispatch(getInvoices({ page: 1, limit: 10 }))
    handleClose()
  }

  // Only show delivered sales orders (eligible for invoice)
  const eligibleOrders = salesOrders.filter(
    o => o.status === "delivered" || o.status === "confirmed"
  )

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create Invoice</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>

          {/* Sales Order Select */}
          <Grid item xs={12}>
            <TextField
              label="Sales Order" select fullWidth
              value={salesOrderId}
              onChange={(e) => setSalesOrderId(e.target.value)}
            >
              {eligibleOrders.length === 0 ? (
                <MenuItem disabled>No eligible sales orders</MenuItem>
              ) : (
                eligibleOrders.map((o) => (
                  <MenuItem key={o._id} value={o._id}>
                    {o.customer?.name} — ₹{o.totalPrice} ({o.status})
                  </MenuItem>
                ))
              )}
            </TextField>
          </Grid>

          {/* Due Date */}
          <Grid item xs={12}>
            <TextField
              label="Due Date" type="date" fullWidth
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="caption" color="text.secondary">
              💡 Invoice will be auto-generated from the selected sales order items
            </Typography>
          </Grid>

        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} color="inherit">Cancel</Button>
        <Button variant="contained" onClick={onSubmit} disabled={!salesOrderId || !dueDate}>
          Create Invoice
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default InvoiceDetail