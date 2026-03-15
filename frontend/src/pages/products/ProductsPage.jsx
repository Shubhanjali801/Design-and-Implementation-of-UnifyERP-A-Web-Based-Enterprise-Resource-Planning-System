import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getProducts, removeProduct } from "../../features/products/productSlice"

import {
  Box, Button, TextField, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, IconButton,
  Typography, Chip, Pagination, CircularProgress, InputAdornment
} from "@mui/material"
import AddIcon        from "@mui/icons-material/Add"
import EditIcon       from "@mui/icons-material/Edit"
import DeleteIcon     from "@mui/icons-material/Delete"
import SearchIcon     from "@mui/icons-material/Search"

import ProductForm    from "./ProductForm"

const ProductsPage = () => {
  const dispatch = useDispatch()
  const { items, totalPages, isLoading } = useSelector((state) => state.products)

  const [search,      setSearch]      = useState("")
  const [page,        setPage]        = useState(1)
  const [openForm,    setOpenForm]    = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  // Fetch products on page/search change
  useEffect(() => {
    dispatch(getProducts({ page, limit: 10, search }))
  }, [dispatch, page, search])

  const handleEdit = (product) => {
    setEditingProduct(product)
    setOpenForm(true)
  }

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(removeProduct(id))
    }
  }

  const handleCloseForm = () => {
    setOpenForm(false)
    setEditingProduct(null)
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">Products</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenForm(true)}
        >
          Add Product
        </Button>
      </Box>

      {/* Search */}
      <TextField
        placeholder="Search by name, SKU..."
        size="small"
        sx={{ mb: 2, width: 300 }}
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1) }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          )
        }}
      />

      {/* Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell><b>Title</b></TableCell>
              <TableCell><b>SKU</b></TableCell>
              <TableCell><b>Price</b></TableCell>
              <TableCell><b>Stock</b></TableCell>
              <TableCell><b>Reorder Level</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">No products found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              items.map((product) => (
                <TableRow key={product._id} hover>
                  <TableCell>{product.title}</TableCell>
                  <TableCell>{product.SKU}</TableCell>
                  <TableCell>₹{product.price}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>{product.reorderLevel}</TableCell>
                  <TableCell>
                    <Chip
                      label={product.stock <= product.reorderLevel ? "Low Stock" : "In Stock"}
                      color={product.stock <= product.reorderLevel ? "error" : "success"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleEdit(product)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(product._id)}>
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
          count={totalPages}
          page={page}
          onChange={(_, val) => setPage(val)}
          color="primary"
        />
      </Box>

      {/* Add/Edit Form Modal */}
      <ProductForm
        open={openForm}
        onClose={handleCloseForm}
        editingProduct={editingProduct}
      />
    </Box>
  )
}

export default ProductsPage