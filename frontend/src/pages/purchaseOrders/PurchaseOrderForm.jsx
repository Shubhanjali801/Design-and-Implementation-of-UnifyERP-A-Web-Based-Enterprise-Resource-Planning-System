import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addPurchaseOrder, getPurchaseOrders } from "../../features/purchaseOrders/purchaseOrderSlice"
import { getSuppliers } from "../../features/suppliers/supplierSlice"
import { getProducts }  from "../../features/products/productSlice"

import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Grid, MenuItem, TextField, Typography,
  IconButton, Box, Divider
} from "@mui/material"
import AddIcon    from "@mui/icons-material/Add"
import DeleteIcon from "@mui/icons-material/Delete"

const emptyItems = () => [{ product: "", quantity: 1, price: 0 }]

const PurchaseOrderForm = ({ open, onClose }) => {
  const dispatch  = useDispatch()
  const suppliers = useSelector((state) => state.suppliers.items)
  const products  = useSelector((state) => state.products.items)

  const [supplierId, setSupplierId] = useState("")
  const [orderItems, setOrderItems] = useState(emptyItems())

  // ✅ Only fetch data here — NO setState
  useEffect(() => {
    if (open) {
      dispatch(getSuppliers({ page: 1, limit: 100 }))
      dispatch(getProducts({ page: 1, limit: 100 }))
    }
  }, [open, dispatch])

  const handleItemChange = (index, field, value) => {
    const updated = [...orderItems]
    updated[index][field] = value
    if (field === "product") {
      const product = products.find(p => p._id === value)
      if (product) updated[index].price = product.price
    }
    setOrderItems(updated)
  }

  const addItem = () => {
    setOrderItems([...orderItems, { product: "", quantity: 1, price: 0 }])
  }

  const removeItem = (index) => {
    setOrderItems(orderItems.filter((_, i) => i !== index))
  }

  // ✅ Reset directly inside handler — not in useEffect
  const handleClose = () => {
    setSupplierId("")
    setOrderItems(emptyItems())
    onClose()
  }

  const totalPreview = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const onSubmit = async () => {
    if (!supplierId) return alert("Please select a supplier")
    if (orderItems.some(i => !i.product)) return alert("Please select product for all items")

    await dispatch(addPurchaseOrder({
      supplier: supplierId,
      products: orderItems,
    }))
    dispatch(getPurchaseOrders({ page: 1, limit: 10 }))
    handleClose() // ✅ resets and closes
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create Purchase Order</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>

          <Grid item xs={12}>
            <TextField
              label="Supplier" select fullWidth
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
            >
              {suppliers.map((s) => (
                <MenuItem key={s._id} value={s._id}>{s.name}</MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" fontWeight="bold" mb={1}>Products</Typography>
            {orderItems.map((item, index) => (
              <Box key={index} sx={{ display: "flex", gap: 1, mb: 1.5, alignItems: "center" }}>
                <TextField
                  label="Product" select fullWidth
                  value={item.product}
                  onChange={(e) => handleItemChange(index, "product", e.target.value)}
                  size="small"
                >
                  {products.map((p) => (
                    <MenuItem key={p._id} value={p._id}>
                      {p.title} — ₹{p.price}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  label="Qty" type="number"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, "quantity", Number(e.target.value))}
                  size="small" sx={{ width: 80 }}
                  inputProps={{ min: 1 }}
                />

                <TextField
                  label="Price" type="number"
                  value={item.price}
                  onChange={(e) => handleItemChange(index, "price", Number(e.target.value))}
                  size="small" sx={{ width: 100 }}
                  inputProps={{ min: 0 }}
                />

                <IconButton color="error" onClick={() => removeItem(index)} disabled={orderItems.length === 1}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}

            <Button startIcon={<AddIcon />} onClick={addItem} size="small" sx={{ mt: 0.5 }}>
              Add Product
            </Button>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle1" fontWeight="bold" textAlign="right">
              Total: ₹{totalPreview.toFixed(2)}
            </Typography>
          </Grid>

        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} color="inherit">Cancel</Button>
        <Button variant="contained" onClick={onSubmit}>Create Order</Button>
      </DialogActions>
    </Dialog>
  )
}

export default PurchaseOrderForm