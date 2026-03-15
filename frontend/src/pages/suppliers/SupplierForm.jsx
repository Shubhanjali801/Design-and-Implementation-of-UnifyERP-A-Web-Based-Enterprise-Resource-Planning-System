import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useDispatch } from "react-redux"
import { addSupplier, editSupplier, getSuppliers } from "../../features/suppliers/supplierSlice"

import {
  Dialog, DialogTitle, DialogContent,
  DialogActions, Button, TextField, Grid
} from "@mui/material"

const schema = yup.object({
  name:    yup.string().required("Name is required"),
  contact: yup.string().required("Contact is required"),
  email:   yup.string().email("Invalid email"),
  address: yup.string().required("Address is required"),
})

const SupplierForm = ({ open, onClose, editingSupplier }) => {
  const dispatch = useDispatch()
  const isEdit   = !!editingSupplier

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  })

  useEffect(() => {
    if (editingSupplier) {
      reset(editingSupplier)
    } else {
      reset({ name: "", contact: "", email: "", address: "" })
    }
  }, [editingSupplier, reset])

  const onSubmit = async (data) => {
    if (isEdit) {
      await dispatch(editSupplier({ id: editingSupplier._id, data }))
    } else {
      await dispatch(addSupplier(data))
    }
    dispatch(getSuppliers({ page: 1, limit: 10 }))
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? "Edit Supplier" : "Add New Supplier"}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={12} sm={6}>
            <TextField label="Company Name" fullWidth {...register("name")}
              error={!!errors.name} helperText={errors.name?.message} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Contact Number" fullWidth {...register("contact")}
              error={!!errors.contact} helperText={errors.contact?.message} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Email" fullWidth {...register("email")}
              error={!!errors.email} helperText={errors.email?.message} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Address" fullWidth {...register("address")}
              error={!!errors.address} helperText={errors.address?.message} />
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

export default SupplierForm