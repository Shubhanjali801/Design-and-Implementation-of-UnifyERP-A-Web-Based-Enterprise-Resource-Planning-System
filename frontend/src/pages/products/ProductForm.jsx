import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useDispatch } from "react-redux"
import { addProduct, editProduct, getProducts } from "../../features/products/productSlice"

import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Grid, MenuItem
} from "@mui/material"

const schema = yup.object({
  title:        yup.string().required("Title is required"),
  SKU:          yup.string().required("SKU is required"),
  price:        yup.number().min(0).required("Price is required"),
  stock:        yup.number().min(0).required("Stock is required"),
  reorderLevel: yup.number().min(0).required("Reorder level is required"),
  category:     yup.string(),
  unit:         yup.string(),
})

const units = ["pieces", "kg", "lbs", "liters", "meters", "boxes", "packs"]

const ProductForm = ({ open, onClose, editingProduct }) => {
  const dispatch = useDispatch()
  const isEdit   = !!editingProduct

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { unit: "pieces" }
  })

  // Fill form when editing
  useEffect(() => {
    if (editingProduct) {
      reset(editingProduct)
    } else {
      reset({ title: "", SKU: "", price: "", stock: "", reorderLevel: "", category: "", unit: "pieces" })
    }
  }, [editingProduct, reset])

  const onSubmit = async (data) => {
    if (isEdit) {
      await dispatch(editProduct({ id: editingProduct._id, data }))
    } else {
      await dispatch(addProduct(data))
    }
    dispatch(getProducts({ page: 1, limit: 10 }))
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? "Edit Product" : "Add New Product"}</DialogTitle>

      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>

          <Grid item xs={12} sm={6}>
            <TextField label="Title" fullWidth {...register("title")}
              error={!!errors.title} helperText={errors.title?.message} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField label="SKU" fullWidth {...register("SKU")}
              error={!!errors.SKU} helperText={errors.SKU?.message} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField label="Price (₹)" type="number" fullWidth {...register("price")}
              error={!!errors.price} helperText={errors.price?.message} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField label="Stock" type="number" fullWidth {...register("stock")}
              error={!!errors.stock} helperText={errors.stock?.message} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField label="Reorder Level" type="number" fullWidth {...register("reorderLevel")}
              error={!!errors.reorderLevel} helperText={errors.reorderLevel?.message} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField label="Category" fullWidth {...register("category")} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField label="Unit" select fullWidth defaultValue="pieces" {...register("unit")}>
              {units.map((u) => (
                <MenuItem key={u} value={u}>{u}</MenuItem>
              ))}
            </TextField>
          </Grid>

        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button variant="contained" onClick={handleSubmit(onSubmit)}>
          {isEdit ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ProductForm