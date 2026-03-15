import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addGRN, getGRNs } from "../../features/grn/grnSlice"
import { getPurchaseOrders } from "../../features/purchaseOrders/purchaseOrderSlice"

import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Grid, MenuItem, TextField, Typography,
  Box, Divider
} from "@mui/material"

const GRNForm = ({ open, onClose }) => {
  const dispatch       = useDispatch()
  const purchaseOrders = useSelector((state) => state.purchaseOrders?.items ?? [])

  const [selectedPO,    setSelectedPO]    = useState("")
  const [receivedItems, setReceivedItems] = useState([])
  const [receiptDate,   setReceiptDate]   = useState("")

  // Fetch purchase orders
  useEffect(() => {
    if (open) {
      dispatch(getPurchaseOrders({ page: 1, limit: 100 }))
    }
  }, [open, dispatch])

  // When PO is selected → auto fill received items from PO products
  const handlePOChange = (poId) => {
    setSelectedPO(poId)
    const po = purchaseOrders.find(p => p._id === poId)
    if (po) {
      setReceivedItems(po.products.map(item => ({
        product:           item.product?._id || item.product,
        productName:       item.product?.title || "Product",
        orderedQuantity:   item.quantity,
        receivedQuantity:  item.quantity, // default to full receipt
        price:             item.price,
      })))
    }
  }

  const handleQuantityChange = (index, value) => {
    const updated = [...receivedItems]
    updated[index].receivedQuantity = Number(value)
    setReceivedItems(updated)
  }

  const handleClose = () => {
    setSelectedPO("")
    setReceivedItems([])
    setReceiptDate("")
    onClose()
  }

  const onSubmit = async () => {
  if (!selectedPO)            return alert("Please select a purchase order")
  if (receivedItems.length === 0) return alert("No items to receive")

  await dispatch(addGRN({
    purchaseOrder: selectedPO,
    receivedItems: receivedItems.map((item) => ({
      product:          item.product,
      orderedQuantity:  item.orderedQuantity,
      receivedQuantity: item.receivedQuantity,
      price:            item.price,
    })),
    receiptDate: receiptDate || new Date().toISOString(),
  }))

  dispatch(getGRNs({ page: 1, limit: 10 }))
  handleClose()
}

  // Only show POs that are pending or confirmed (not received/cancelled)
  const eligiblePOs = purchaseOrders.filter(
    po => po.status === "pending" || po.status === "confirmed"
  )

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create GRN</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>

          {/* Purchase Order Select */}
          <Grid item xs={12}>
            <TextField
              label="Purchase Order" select fullWidth
              value={selectedPO}
              onChange={(e) => handlePOChange(e.target.value)}
            >
              {eligiblePOs.length === 0 ? (
                <MenuItem disabled>No eligible purchase orders</MenuItem>
              ) : (
                eligiblePOs.map((po) => (
                  <MenuItem key={po._id} value={po._id}>
                    {po.supplier?.name} — {new Date(po.createdAt).toLocaleDateString()} ({po.status})
                  </MenuItem>
                ))
              )}
            </TextField>
          </Grid>

          {/* Receipt Date */}
          <Grid item xs={12}>
            <TextField
              label="Receipt Date" type="date" fullWidth
              value={receiptDate}
              onChange={(e) => setReceiptDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* Received Items */}
          {receivedItems.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight="bold" mb={1}>
                Received Items
              </Typography>
              {receivedItems.map((item, index) => (
                <Box key={index} sx={{ display: "flex", gap: 1, mb: 1.5, alignItems: "center" }}>
                  <TextField
                    label="Product" value={item.productName}
                    size="small" fullWidth disabled
                  />
                  <TextField
                    label="Ordered" value={item.orderedQuantity}
                    size="small" sx={{ width: 90 }} disabled
                  />
                  <TextField
                    label="Received" type="number"
                    value={item.receivedQuantity}
                    onChange={(e) => handleQuantityChange(index, e.target.value)}
                    size="small" sx={{ width: 90 }}
                    inputProps={{ min: 0, max: item.orderedQuantity }}
                  />
                </Box>
              ))}
              <Divider sx={{ mt: 1 }} />
              <Typography variant="caption" color="text.secondary" mt={1} display="block">
                💡 If received quantity is less than ordered → GRN status = Partial
              </Typography>
            </Grid>
          )}

        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} color="inherit">Cancel</Button>
        <Button variant="contained" onClick={onSubmit} disabled={!selectedPO}>
          Create GRN
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default GRNForm