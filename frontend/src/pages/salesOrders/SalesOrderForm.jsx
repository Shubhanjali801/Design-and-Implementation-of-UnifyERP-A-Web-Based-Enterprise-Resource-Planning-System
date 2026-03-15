import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addSalesOrder, getSalesOrders } from "../../features/salesOrders/salesOrderSlice"
import { getCustomers } from "../../features/customers/customerSlice"
import { getProducts }  from "../../features/products/productSlice"

import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Grid, MenuItem, TextField, Typography,
  IconButton, Box, Divider
} from "@mui/material"
import AddIcon    from "@mui/icons-material/Add"
import DeleteIcon from "@mui/icons-material/Delete"

const emptyItems = () => [{ product: "", quantity: 1 }]

const SalesOrderForm = ({ open, onClose }) => {
  const dispatch  = useDispatch()
  const customers = useSelector((state) => state.customers.items)
  const products  = useSelector((state) => state.products.items)

  const [customerId, setCustomerId] = useState("")
  const [orderItems, setOrderItems] = useState(emptyItems())


  useEffect(() => {
    if (open) {
      dispatch(getCustomers({ page: 1, limit: 100 }))
      dispatch(getProducts({ page: 1, limit: 100 }))
    }
  }, [open, dispatch])

  const handleItemChange = (index, field, value) => {
    const updated = [...orderItems]
    updated[index][field] = value
    setOrderItems(updated)
  }

  const addItem = () => {
    setOrderItems([...orderItems, { product: "", quantity: 1 }])
  }

  const removeItem = (index) => {
    setOrderItems(orderItems.filter((_, i) => i !== index))
  }

  const handleClose = () => {
    setCustomerId("")
    setOrderItems(emptyItems())
    onClose()
  }

  const totalPreview = orderItems.reduce((sum, item) => {
    const product = products.find(p => p._id === item.product)
    return sum + (product ? product.price * item.quantity : 0)
  }, 0)

  const onSubmit = async () => {
    if (!customerId) return alert("Please select a customer")
    if (orderItems.some(i => !i.product)) return alert("Please select product for all items")

    await dispatch(addSalesOrder({
      customer: customerId,
      products: orderItems,
    }))
    dispatch(getSalesOrders({ page: 1, limit: 10 }))
    handleClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Sales Order</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>

          {/* Customer Select */}
          <Grid item xs={12}>
            <TextField
              label="Customer" select fullWidth
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
            >
              {customers.map((c) => (
                <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Product Items */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" fontWeight="bold" mb={1}>
              Products
            </Typography>

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
                      {p.title} (Stock: {p.stock}) — ₹{p.price}
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

                <IconButton
                  color="error"
                  onClick={() => removeItem(index)}
                  disabled={orderItems.length === 1}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}

            <Button startIcon={<AddIcon />} onClick={addItem} size="small" sx={{ mt: 0.5 }}>
              Add Product
            </Button>
          </Grid>

          {/* Total Preview */}
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

export default SalesOrderForm